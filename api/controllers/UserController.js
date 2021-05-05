module.exports = {
  /**
   * Get user by given id
   * @param {*} req
   * @param {*} res
   * @returns Response
   */
  getUserById: async (req, res) => {
    let userId = Number(req.params['user_id']);

    if(!userId) {
      return res.badRequest('Invalid user id');
    }

    let user = await UserService.getUserById(userId);

    return res.json({ user });
  },

  /**
   * Purchase a dish for given dishId, quantity or userId
   * @param {*} req
   * @param {*} res
   * @returns Promise
   */
  purchaseDish: async (req, res) => {
    let { dishId, quantity, userId } = req.body;

    if (!Number(dishId) || !Number(quantity) || !Number(userId)) {
      return res.badRequest('dishId, quantity, userId are required parameters');
    }

    let results;

    try{
      results = await UserService.purchaseItem(userId, dishId, quantity);
    } catch(e) {
      if (e.name === 'badRequest') {
        return res.badRequest(e.message);
      }

      return res.status(500).json({
        name: 'serverError',
        message: 'Something went wrong while placing your order.'
      });
    }

    return res.json({ results, message: 'Dish ordered successfully' });
  }
};
