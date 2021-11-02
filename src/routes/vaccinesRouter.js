const express = require('express');

const virusTrackerGateway = require('../gateways/virusTrackerGateway');
const vaccinesController = require('../controllers/vaccinesController')(virusTrackerGateway());
const { adminsAuthenticationMiddleware } = require('../middlewares/authenticationMiddleware');

module.exports = function rulesRouter() {
  return express.Router().use(
    '/vaccines',
    express.Router()
      .get('/', vaccinesController.get)
      .post('/', adminsAuthenticationMiddleware, vaccinesController.add)
      .delete('/', adminsAuthenticationMiddleware, vaccinesController.remove)
      .put('/', adminsAuthenticationMiddleware, vaccinesController.update)
  );
};
