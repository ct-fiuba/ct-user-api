const express = require('express');

const virusTrackerGateway = require('../gateways/virusTrackerGateway');
const rulesController = require('../controllers/rulesController')(virusTrackerGateway());

module.exports = function rulesRouter() {
  return express.Router().use(
    '/rules',
    express.Router()
      .get('/:ruleId', rulesController.getSingleRule)
      .get('/', rulesController.get)
      .post('/', rulesController.add)
      .delete('/', rulesController.remove)      
      .put('/', rulesController.update)
  );
};
