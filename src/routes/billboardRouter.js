const express = require('express');
const { usersAuthenticationMiddleware } = require('../middlewares/authenticationMiddleware');

const codesWhispererGateway = require('../gateways/codesWhispererGateway');
const billboardController = require('../controllers/billboardController')(codesWhispererGateway());

module.exports = function visitsRouter() {
  return express.Router().use(
    '/billboard',
    express.Router()
      .get('/', usersAuthenticationMiddleware, billboardController.get)
  );
};
