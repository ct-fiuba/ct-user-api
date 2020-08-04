const request = require('request');

module.exports = function establishmentsController(visitManagerGateway) {
  const get = async (req, res, next) => {
    let filters = req.query;
    let visitManagerResponse = await visitManagerGateway.findEstablishments(filters)
    //res.status(visitManagerResponse.status)
    visitManagerResponse.pipe(res)
  };

  const getSingleEstablishment = async (req, res, next) => {
    return visitManagerGateway.findEstablishment(req.params.establishmentId).then(response => res.send(response))
  };

  const add = async (req, res, next) => {
    return visitManagerGateway.addEstablishment(req.body).then(response => res.send(response))
  };

  const update = async (req, res, next) => {
    establishmentId = req.params.establishmentId;
    return visitManagerGateway.updateEstablishment(establishmentId, req.body).then(response => res.send(response))
  };

  const remove = async (req, res, next) => {
    return visitManagerGateway.deleteEstablishment(req.params.establishmentId).then(response => res.send(response))
  };

  return {
    add,
    get,
    getSingleEstablishment,
    update,
    remove
  };
};
