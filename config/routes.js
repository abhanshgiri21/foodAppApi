/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  // User Actions
  'GET /user/:user_id'          : 'UserController.getUserById',
  'POST /user/purchase'        : 'UserController.purchaseDish',

  // Restaurant Actions
  'GET /restaurant/:restaurant_id': 'RestaurantController.getRestaurantById',
  'GET /restaurant/dish-price'    : 'RestaurantController.getRestaurantWithDishPriceFilter',
  'GET /restaurant/open'          : 'RestaurantController.getOpenRestaurants',
  'GET /restaurant/search'        : 'RestaurantController.searchRestaurants'
};
