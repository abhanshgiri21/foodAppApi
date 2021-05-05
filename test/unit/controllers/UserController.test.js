const { expect } = require("chai");
const sinon = require('sinon');

const userByIdFixture = {
  'user': {
    'orders': [
      {
        'createdAt': '2021-05-03T20:41:04.000Z',
        'id': 9309,
        'amount': 2,
        'user': 1001,
        'restaurant': 2204,
        'dish': 18717
      },
      {
        'createdAt': '2021-05-03T20:47:22.000Z',
        'id': 9311,
        'amount': 50,
        'user': 1001,
        'restaurant': 2204,
        'dish': 18717
      },
      {
        'createdAt': '2021-05-03T21:09:00.000Z',
        'id': 9312,
        'amount': 50,
        'user': 1001,
        'restaurant': 2204,
        'dish': 18717
      }
    ],
    'createdAt': '2021-05-03T19:05:40.000Z',
    'id': 1001,
    'name': 'testuser',
    'balance': 0
  }
};

describe('UserController', () => {
  describe('getUsers', () => {
    it('should return user details along with order if correct id is passed', (done) => {
      sinon.stub(UserService, 'getUserById').resolves(userByIdFixture.user);

      app()
        .get('/user/1001')
        .expect(200)
        .expect(res => {
          expect(res.body.user).to.be.ok;
          expect(res.body.user.id).to.eql(1001);
          expect(res.body.user.name).to.eql('testuser');
          expect(res.body.user.orders).to.be.ok;
          expect(res.body.user.orders.length).to.eql(3);
        })
        .end(done);
    });

    it('should return error when user id is invalid', (done) => {
      sinon.stub(UserService, 'getUserById').resolves(userByIdFixture.user);

      app()
        .get('/user/test')
        .expect(400)
        .expect(res => {
          expect(res.body.user).to.not.be.ok;
          expect(res.body.name).to.eql('BadRequest');
          expect(res.body.message).to.eql('Invalid user id');
        })
        .end(done);
    });
  });

  describe('purchaseDish', () => {
    it('should purchase a dish successfully if correct params are given', (done) => {
      sinon.stub(UserService, 'purchaseItem').resolves(true);

      app()
        .post('/user/purchase')
        .send({
          dishId: 1,
          quantity: 2,
          userId: 1
        })
        .expect(200)
        .expect(res => {
          expect(res.body.results).to.be.ok;
          expect(res.body.message).to.eql('Dish ordered successfully');
        })
        .end(done)
    });

    it('should return error if dishId or quantity is not supplied', (done) => {
      sinon.stub(UserService, 'purchaseItem').resolves(true);

      app()
        .post('/user/purchase')
        .send({
          userId: 1
        })
        .expect(400)
        .expect(res => {
          expect(res.body.name).to.eql('BadRequest');
          expect(res.body.message).to.eql('dishId, quantity, userId are required parameters');
        })
        .end(done)
    });

    it('should relay badRequest type errors correctly from UserService', (done) => {
      sinon.stub(UserService, 'purchaseItem').rejects({ name: 'badRequest', message: 'badRequest error message' });

      app()
        .post('/user/purchase')
        .send({
          dishId: 1,
          quantity: 2,
          userId: 1
        })
        .expect(400)
        .expect(res => {
          expect(res.body.name).to.eql('BadRequest');
          expect(res.body.message).to.eql('badRequest error message');
        })
        .end(done)
    });

    it('should relay exceptions from UserService as serverError', (done) => {
      sinon.stub(UserService, 'purchaseItem').rejects({ name: 'E_NOT_FOUND' });

      app()
        .post('/user/purchase')
        .send({
          dishId: 1,
          quantity: 2,
          userId: 1
        })
        .expect(500)
        .expect(res => {
          expect(res.body.name).to.eql('serverError');
          expect(res.body.message).to.eql('Something went wrong while placing your order.');
        })
        .end(done)
    });
  })
});
