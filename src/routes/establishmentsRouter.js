const express = require('express');

const { authenticationMiddleware } = require('../middlewares/authenticationMiddleware');

const visitManagerGateway = require('../gateways/visitManagerGateway');
const establishmentsController = require('../controllers/establishmentsController')(visitManagerGateway());

module.exports = function establishmentsRouter() {
  return express.Router().use(
    '/establishments',
    express.Router()
      .get('/', authenticationMiddleware, establishmentsController.get)
      .post('/', establishmentsController.add)
      .get('/:establishmentId', authenticationMiddleware, establishmentsController.getSingleEstablishment)
      .get('/PDF/:establishmentId', authenticationMiddleware, establishmentsController.getEstablishmentPDF)
      .put('/:establishmentId', authenticationMiddleware, establishmentsController.update)
      .delete('/:establishmentId', authenticationMiddleware, establishmentsController.remove)
  );
};
