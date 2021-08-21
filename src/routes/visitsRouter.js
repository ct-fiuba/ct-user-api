const express = require('express');
const { genuxMiddleware } = require('../middlewares/authenticationMiddleware');

const visitManagerGateway = require('../gateways/visitManagerGateway');
const visitsController = require('../controllers/visitsController')(visitManagerGateway());

module.exports = function visitsRouter() {
  return express.Router().use(
    '/visits',
    express.Router()
      .post('/', genuxMiddleware, visitsController.add)
      .post('/addExitTimestamp', genuxMiddleware, visitsController.addExitTimestamp)
  );
};
