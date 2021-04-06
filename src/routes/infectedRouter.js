const express = require('express');
const { authenticationMiddleware, genuxMiddleware } = require('../middlewares/authenticationMiddleware');

const virusTrackerGateway = require('../gateways/virusTrackerGateway');
const infectedController = require('../controllers/infectedController')(virusTrackerGateway());

module.exports = function visitsRouter() {
  return express.Router().use(
    '/infected',
    express.Router()
      .post('/', authenticationMiddleware, genuxMiddleware, infectedController.add)
  );
};
