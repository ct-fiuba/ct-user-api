const express = require('express');

const {
  ownersAuthenticationMiddleware,
  adminsAuthenticationMiddleware
} = require('../middlewares/authenticationMiddleware');

const visitManagerGateway = require('../gateways/visitManagerGateway');
const establishmentsController = require('../controllers/establishmentsController')(visitManagerGateway());

module.exports = function establishmentsRouter() {
  return express.Router().use(
    '/establishments',
    express.Router()
      .get('/', adminsAuthenticationMiddleware, establishmentsController.get)
      .post('/', ownersAuthenticationMiddleware, establishmentsController.add)
      .post('/space', ownersAuthenticationMiddleware, establishmentsController.addSingleSpace)
      .get('/:establishmentId', ownersAuthenticationMiddleware, establishmentsController.getSingleEstablishment)
      .get('/owner/:ownerId', ownersAuthenticationMiddleware, establishmentsController.getEstablishmentsByOwner)
      .get('/PDF/:establishmentId', establishmentsController.getEstablishmentPDF)
      .get('/PDF/:establishmentId/space/:spaceId', establishmentsController.getSingleSpacePDF)
      .put('/:establishmentId', ownersAuthenticationMiddleware, establishmentsController.update)
      .put('/space/:spaceId', ownersAuthenticationMiddleware, establishmentsController.updateSpace)
      .delete('/:establishmentId', adminsAuthenticationMiddleware, establishmentsController.remove)
  );
};
