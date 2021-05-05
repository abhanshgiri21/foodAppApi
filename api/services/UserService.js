const flaverr = require('flaverr');

module.exports = {
  /**
   * Find a user by it's id
   * @param {Number} userId The id of user to find
   * @returns Promise
   */
  getUserById: function (userId) {
    return User.findOne({ id: userId }).populate('orders');
  },

  /**
   * Orchestrate a transactional for for purchase of a given quantity of dish by the user
   * @param {Number} userId    Id of user making the purchase
   * @param {Number} dishId    Id of dish the user intends to purchase
   * @param {Number} quantity  Quantity of given dishId user intends to purchase
   * @returns Promise
   */
  purchaseItem: function (userId, dishId, quantity) {
    return new Promise(async (resolve, reject) => {
      await sails.getDatastore().transaction(async (db) => {
        let dish = await Menu.findOne({ id: Number(dishId) }).usingConnection(db);

        if (dish.rows && dish.rows.length === 0) {
          return reject(flaverr({
            name: 'badRequest',
            message: 'Dish with the given dish id doesn\'t exist'
          }));
        }

        let user = await User.findOne({ id: userId }).usingConnection(db);

        if (user.rows && user.rows.length === 0) {
          return reject(flaverr({
            name: 'badRequest',
            message: 'User with the given user id doesn\'t exist'
          }));
        }

        let balanceRequired = dish.price * quantity;

        if (user.balance < balanceRequired) {
          return reject(flaverr({
            name: 'badRequest',
            message: 'User has insufficient balance to purchase given quantity'
          }));
        }

        await User.updateOne({ id: userId }).set({
          balance: `${user.balance - balanceRequired}`
        }).usingConnection(db);

        await Order.create({
          user: userId,
          restaurant: dish.restaurant,
          dish: dishId,
          amount: balanceRequired
        }).usingConnection(db);

        await sails.sendNativeQuery(`UPDATE restaurants SET balance=balance+${balanceRequired} WHERE id=${dish.restaurant};`).usingConnection(db);

        return resolve(true);
      }).catch(err => {
        reject(err);
      });
    });
  }
};
