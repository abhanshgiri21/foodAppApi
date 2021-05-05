const fs = require('fs'),

  async = require('async'),
  chai = require('chai'),
  request = require('supertest'),
  sinon = require('sinon'),
  nock = require('nock'),
  Sails = new require('sails').Sails();

before(function (done) {
  global.app = function app () {
    return request(sails.hooks.http.app);
  };

  global.async = async;
  global.expect = chai.expect;
  global.sinon = sinon.createSandbox();
  global.nock = nock;

  Sails.lift({
    environment: 'development',
    log: {
      level: 'silent'
    }
  },
  function (err) {
    if (err) { return done(err); }

    return done();
  });
});

afterEach(function globalAfterEach (done) {
  sinon.restore();
  nock.cleanAll();

  return done();
});

after(function (done) {
  delete global.app;
  delete global.async;
  delete global.expect;
  delete global.sinon;
  delete global.nock;

  sails.lower(done);
});
