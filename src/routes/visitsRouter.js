const express = require('express');
const genuxMiddleware = require('../middlewares/genuxMiddleware')();

const visitManagerGateway = require('../gateways/visitManagerGateway');
const visitsController = require('../controllers/visitsController')(visitManagerGateway());

module.exports = function visitsRouter() {
  return express.Router().use(
    '/visits',
    express.Router()
      .get('/', visitsController.get)
      .post('/', genuxMiddleware, visitsController.add)
  );
};
