module.exports = {
  /**
   * Find restaurant with given id along with orders, openingHours and Orders
   * @param {Number} restaurantId Id of the restaurant to find
   * @returns Promise
   */
  getRestaurantById: function (restaurantId) {
    return Restaurant.findOne({ id: restaurantId }).populate('orders').populate('menuItems');
  },

  /**
   * Fetch restaurants with given price and dishCount filter
   * @param {Number} dishCount  Number of dishes required above or below minPrice/maxPrice to filter restaurant
   * @param {Number} maxPrice   Maximum allowed price for the dishes to consider
   * @param {Number} minPrice   Minimum allowed price for the dishes to consider
   * @param {Number} limit      Number of restaurants to return
   * @param {Number} offset     Number of restaurants to skip before selecting restaurants for results
   * @returns Promise
   */
  getRestaurantsWithDishPriceFilter: function (dishCount, maxPrice, minPrice, limit, offset) {
    let whereClause = maxPrice && minPrice ? `m.price >= ${minPrice} AND m.price <= ${maxPrice}` : maxPrice ? `m.price <= ${maxPrice}` : `m.price >= ${minPrice}`;

    return sails.sendNativeQuery(`SELECT r.id, r.name, r.balance, COUNT(m.id) as dishCount FROM restaurants r LEFT JOIN menu m ON r.id=m.restaurant WHERE ${whereClause} GROUP BY m.restaurant HAVING dishCount >= ${dishCount} ORDER BY dishCount DESC LIMIT ${limit} OFFSET ${offset};`);
  },

  /**
   * Fetch open restaurants for given dayNumber and opening time
   * @param {Number} dayNumber      Number of given day to check the restaurant
   * @param {Number} secondsValue   Time of day in seconds to check opening hours
   * @param {Number} limit          Number of restaurants to return
   * @param {Number} offset         Number of restaurants to skip from start before returning results
   * @returns Promise
   */
  getOpenRestaurants: function (dayNumber, secondsValue, limit, offset) {
    return sails.sendNativeQuery(`SELECT r.id, r.name, r.balance FROM restaurants r LEFT JOIN opening_hours o ON r.id=o.restaurant WHERE o.start <=${secondsValue} AND o.end >= ${secondsValue} AND day=${dayNumber} LIMIT ${limit} OFFSET ${offset};`);
  },

  /**
   * Search restaurants and their dishes by given search term
   * @param {String} searchTerm Term to search restaurants and dishes
   * @param {Number} limit Max number of restaurants to return
   * @param {Number} offset Number of restaurants to offset before returning results
   * @returns Promise
   */
  searchRestaurants: function (searchTerm, limit, offset) {
    return sails.sendNativeQuery(`SELECT DISTINCT r.id, r.name, r.balance,  CONVERT(MATCH (r.name) AGAINST ("${searchTerm}") * 10 + MATCH(d.name) AGAINST ("${searchTerm}"), DECIMAL(10, 5))   as relevance FROM restaurants r LEFT JOIN menu d ON r.id=d.restaurant HAVING relevance > 0 ORDER BY relevance DESC LIMIT ${limit} OFFSET ${offset};`)
  }
};
