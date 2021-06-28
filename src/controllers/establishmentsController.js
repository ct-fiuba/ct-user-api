const pipelineResponse = require('./utils');

module.exports = function establishmentsController(visitManagerGateway) {
  const get = async (req, res, next) => {
    let filters = req.query;
    let visitManagerResponse = await visitManagerGateway.findEstablishments(filters)
    pipelineResponse(visitManagerResponse, res)
  };

  const getEstablishmentsByOwner = async (req, res, next) => {
    let visitManagerResponse = await visitManagerGateway.findEstablishmentsByOwner(req.params.ownerId)
    pipelineResponse(visitManagerResponse, res)
  };

  const getSingleEstablishment = async (req, res, next) => {
    let visitManagerResponse = await visitManagerGateway.findEstablishment(req.params.establishmentId)
    pipelineResponse(visitManagerResponse, res)
  };

  const getEstablishmentPDF = async (req, res, next) => {
    let visitManagerResponse = await visitManagerGateway.getEstablishmentPDF(req.params.establishmentId)
    pipelineResponse(visitManagerResponse, res)
  };

  const getSingleSpacePDF = async (req, res, next) => {
    let visitManagerResponse = await visitManagerGateway.getSingleSpacePDF(req.params.establishmentId, req.params.spaceId)
    pipelineResponse(visitManagerResponse, res)
  };
  
  const add = async (req, res, next) => {
    let visitManagerResponse = await visitManagerGateway.addEstablishment(req.body)
    pipelineResponse(visitManagerResponse, res)
  };

  const addSingleSpace = async (req, res, next) => {
    let visitManagerResponse = await visitManagerGateway.addSingleSpace(req.body)
    pipelineResponse(visitManagerResponse, res)
  };

  const update = async (req, res, next) => {
    establishmentId = req.params.establishmentId;
    let visitManagerResponse = await visitManagerGateway.updateEstablishment(establishmentId, req.body)
    pipelineResponse(visitManagerResponse, res)
  };

  const updateSpace = async (req, res, next) => {
    spaceId = req.params.spaceId;
    let visitManagerResponse = await visitManagerGateway.updateSpace(spaceId, req.body)
    pipelineResponse(visitManagerResponse, res)
  };

  const remove = async (req, res, next) => {
    let visitManagerResponse = await visitManagerGateway.deleteEstablishment(req.params.establishmentId)
    pipelineResponse(visitManagerResponse, res)
  };

  return {
    add,
    addSingleSpace,
    get,
    getEstablishmentsByOwner,
    getSingleEstablishment,
    getEstablishmentPDF,
    getSingleSpacePDF,
    update,
    updateSpace,
    remove
  };
};
