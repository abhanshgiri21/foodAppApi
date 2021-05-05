const moment = require('moment');
const RestaurantService = require("../services/RestaurantService");

module.exports = {
  /**
   * Get restaurant details by given id
   * @param {*} req
   * @param {*} res
   * @returns Response
   */
  getRestaurantById: async (req, res) => {
    let restaurantId = Number(req.params['restaurant_id']);

    if (!restaurantId) {
      return res.badRequest('Invalid restaurant id');
    }

    let restaurant = await RestaurantService.getRestaurantById(restaurantId);

    return res.json({ restaurant });
  },

  /**
   * Get open restaurants
   * @param {*} req
   * @param {*} res
   * @returns Response
   */
  getOpenRestaurants: async (req, res) => {
    let datetime = req.query['datetime'], // dd/mm/yy HH:mm
      limit = Number(req.query['limit']),
      offset = Number(req.query['offset']),
      startOfDay,
      dayNumber,
      secondsValue;

    if (!datetime) {
      res.badRequest('datetime is a required query param.');
    }

    if (!moment.utc(datetime, 'DD/MM/YY HH:mm').isValid()) {
      res.badRequest('Invalid datetime format. The required format is "DD/MM/YY HH:mm"');
    }

    // set default values for limit and offset if they're not present/invalid
    limit = limit && limit < 100 ? limit : 10;
    offset = offset ? offset : 0;
    datetime = moment.utc(datetime, 'DD/MM/YY HH:mm');
    startOfDay = moment.utc(datetime.format('DD/MM/YY') + ' 00:00', 'DD/MM/YY HH:mm');

    // get the day number. Sunday is valued as 0, and we label sunday as 7
    dayNumber = datetime.day() === 0 ? 7 : datetime.day();
    secondsValue = datetime.diff(startOfDay, 'seconds');

    // Fetch top 10 restaurant open at given time.
    let results = await RestaurantService.getOpenRestaurants(dayNumber, secondsValue, limit, offset);


    return res.json({ restaurants: results.rows });
  },

  /**
   * Query restaurants based on dish price filter
   * @param {*} req `
   * @param {*} res 
   * @returns Response
   */
  getRestaurantWithDishPriceFilter: async (req, res) => {
    let maxPrice = Number(req.query['maxPrice']),
      minPrice = Number(req.query['minPrice']),
      dishCount = Number(req.query['dishCount']),
      limit = Number(req.query['limit']),
      offset = Number(req.query['offset']);

    if (!maxPrice && !minPrice) {
      return res.badRequest('maxPrice or minPrice is a required query parameter');
    }

    if (!dishCount) {
      return res.badRequest('dishCount is a required query parameter');
    }

    limit = limit && limit < 100 ? limit : 10;
    offset = offset ? offset : 0;

    let results = await RestaurantService.getRestaurantsWithDishPriceFilter(dishCount, maxPrice, minPrice, limit, offset);

    return res.json({
      restaurants: results.rows
    });
  },

  /**
   * Query restaurants and dishes based on search term
   * @param {*} req `
   * @param {*} res 
   * @returns Response
   */
  searchRestaurants: async (req, res) => {
    let searchTerm = req.query['searchTerm'],
      limit = Number(req.query['limit']),
      offset = Number(req.query['offset']);

    if (_.isEmpty(searchTerm) || !_.isString(searchTerm)) {
      return res.badRequest('Invalid searchTerm query param.');
    }

    // set default values for limit and offset if they're not present/invalid
    limit = limit && limit < 100 ? limit : 10;
    offset = offset ? offset : 0;

    let results = await RestaurantService.searchRestaurants(searchTerm, limit, offset);

    return res.json({ restaurants: results.rows });
  }
};
