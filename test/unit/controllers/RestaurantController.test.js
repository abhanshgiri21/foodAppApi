const { expect } = require("chai");
const sinon = require('sinon');

const restaurantByIdFixture = {
  restaurant: {
    orders: [
      {
        id: 1329,
        amount: 13.5,
        user: 151,
        dish: 5
      },
      {
        id: 1412,
        amount: 12.45,
        user: 160,
        dish: 3
      },
    ],
    menuItems: [
      {
        id: 1,
        name: "Postum cereal coffee",
        price: 13.88,
      },
      {
        id: 2,
        name: "GAI TOM K: CHICKEN IN COCONUT CREAM SOUP WITH LIME JUICE GALANGA AND CHILI",
        price: 10.64,
      },
      {
        id: 3,
        name: "Coffee Cocktail (Port Wine",
        price: 12.45,
      }
    ],
    id: 1,
    name: "Ulu Ocean Grill and Sushi Lounge",
    balance: 4511.6
  }
};

describe('RestaurantController', () => {
  describe('getRestaurantById', () => {
    it('should return the correct restaurant for given id', (done) => {
      sinon.stub(RestaurantService, 'getRestaurantById').resolves(restaurantByIdFixture.restaurant);

      app()
        .get('/restaurant/1')
        .expect(200)
        .expect(res =>{
          let restaurant = res.body.restaurant;

          expect(restaurant).to.be.ok;
          expect(restaurant.name).to.eql('Ulu Ocean Grill and Sushi Lounge');
          expect(restaurant.orders.length).to.eql(2)
          expect(restaurant.menuItems.length).to.eql(3)
        })
        .end(done)
    });

    it('should return error on invalid restaurant id', (done) => {
      sinon.stub(RestaurantService, 'getRestaurantById').resolves(restaurantByIdFixture.restaurant);

      app()
        .get('/restaurant/invalid_id')
        .expect(400)
        .expect(res => {
          expect(res.body.user).to.not.be.ok;
          expect(res.body.name).to.eql('BadRequest');
          expect(res.body.message).to.eql('Invalid restaurant id');
        })
        .end(done)
      });
  })

  describe('getOpenRestaurants', () => {
    it('should return open restaurants if correct params are supplied', (done) => {
      sinon.stub(RestaurantService, 'getOpenRestaurants').resolves({ rows: [ restaurantByIdFixture.restaurant ]})
      app()
        .get('/restaurant/open?datetime=27/08/97 22:30')
        .expect(200)
        .expect(res => {
          let restaurants = res.body.restaurants;

          expect(restaurants).to.be.ok;
          expect(restaurants.length).to.eql(1);
        })
        .end(done)
    })

    it('should return error if datetime is not provided', (done) => {
      sinon.stub(RestaurantService, 'getOpenRestaurants').resolves({ rows: [ restaurantByIdFixture.restaurant ]})
      app()
        .get('/restaurant/open')
        .expect(400)
        .expect(res => {
          expect(res.body.name).to.eql('BadRequest');
          expect(res.body.message).to.eql('datetime is a required query param.');
        })
        .end(done)
    })

    it('should return error if datetime is in invalid format', (done) => {
      sinon.stub(RestaurantService, 'getOpenRestaurants').resolves({ rows: [ restaurantByIdFixture.restaurant ]})
      app()
        .get('/restaurant/open?datetime=invalid_format')
        .expect(400)
        .expect(res => {
          expect(res.body.name).to.eql('BadRequest');
          expect(res.body.message).to.eql('Invalid datetime format. The required format is "DD/MM/YY HH:mm"');
        })
        .end(done)
    })
  })

  describe('getRestaurantWithDishPriceFilter', () => {
    it('should return restaurants if correct params are supplied', (done) => {
      sinon.stub(RestaurantService, 'getRestaurantsWithDishPriceFilter').resolves({ rows: [ restaurantByIdFixture.restaurant ]})
      app()
        .get('/restaurant/dish-price?maxPrice=10&minPrice=5&dishCount=1')
        .expect(200)
        .expect(res => {
          let restaurants = res.body.restaurants;

          expect(restaurants).to.be.ok;
          expect(restaurants.length).to.eql(1);
        })
        .end(done)
    })

    it('should return error if maxPrice and minPrice are not provided', (done) => {
      sinon.stub(RestaurantService, 'getOpenRestaurants').resolves({ rows: [ restaurantByIdFixture.restaurant ]})
      app()
        .get('/restaurant/dish-price')
        .expect(400)
        .expect(res => {
          expect(res.body.name).to.eql('BadRequest');
          expect(res.body.message).to.eql('maxPrice or minPrice is a required query parameter');
        })
        .end(done)
    })

    it('should return error if dishCount is not provided', (done) => {
      sinon.stub(RestaurantService, 'getOpenRestaurants').resolves({ rows: [ restaurantByIdFixture.restaurant ]})
      app()
        .get('/restaurant/dish-price?maxPrice=1')
        .expect(400)
        .expect(res => {
          expect(res.body.name).to.eql('BadRequest');
          expect(res.body.message).to.eql('dishCount is a required query parameter');
        })
        .end(done)
    })
  })

  describe('searchRestaurants', () => {
    it('should return restaurants if correct params are supplied', (done) => {
      sinon.stub(RestaurantService, 'searchRestaurants').resolves({ rows: [ restaurantByIdFixture.restaurant ]})

      app()
        .get('/restaurant/search?searchTerm=Light&limit=10&offset=1')
        .expect(200)
        .expect(res => {
          let restaurants = res.body.restaurants;

          expect(restaurants).to.be.ok;
          expect(restaurants.length).to.eql(1);
        })
        .end(done)
    })

    it('should return error if searchTerm is not provided', (done) => {
      sinon.stub(RestaurantService, 'searchRestaurants').resolves({ rows: [ restaurantByIdFixture.restaurant ]});

      app()
        .get('/restaurant/search')
        .expect(400)
        .expect(res => {
          expect(res.body.name).to.eql('BadRequest');
          expect(res.body.message).to.eql('Invalid searchTerm query param.');
        })
        .end(done)
    });
  });
});
