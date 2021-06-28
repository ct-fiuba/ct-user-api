const express = require('express');

const virusTrackerGateway = require('../gateways/virusTrackerGateway');
const rulesController = require('../controllers/rulesController')(virusTrackerGateway());
const { adminsAuthenticationMiddleware } = require('../middlewares/authenticationMiddleware');

module.exports = function rulesRouter() {
  return express.Router().use(
    '/rules',
    express.Router()
      .get('/:ruleId', adminsAuthenticationMiddleware, rulesController.getSingleRule)
      .get('/', adminsAuthenticationMiddleware, rulesController.get)
      .post('/', adminsAuthenticationMiddleware, rulesController.add)
      .delete('/', adminsAuthenticationMiddleware, rulesController.remove)
      .put('/', adminsAuthenticationMiddleware, rulesController.update)
  );
};
