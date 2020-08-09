const express = require('express');

const visitManagerGateway = require('../gateways/visitManagerGateway');
const establishmentsController = require('../controllers/establishmentsController')(visitManagerGateway());

module.exports = function establishmentsRouter() {
  return express.Router().use(
    '/establishments',
    express.Router()
      .get('/', establishmentsController.get)
      .post('/', establishmentsController.add)
      .get('/:establishmentId', establishmentsController.getSingleEstablishment)
      .get('/PDF/:establishmentId', establishmentsController.getEstablishmentPDF)
      .put('/:establishmentId', establishmentsController.update)
      .delete('/:establishmentId', establishmentsController.remove)
  );
};
