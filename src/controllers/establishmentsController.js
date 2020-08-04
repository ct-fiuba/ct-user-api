const pipelineResponse = (stream, res) => {
  stream.on('error', () => {
    res.statusCode = 500;
    res.end('Something went wrong');
  });

  stream.pipe(res)
}

module.exports = function establishmentsController(visitManagerGateway) {
  const get = async (req, res, next) => {
    let filters = req.query;
    let visitManagerResponse = await visitManagerGateway.findEstablishments(filters)
    pipelineResponse(visitManagerResponse, res)
  };

  const getSingleEstablishment = async (req, res, next) => {
    let visitManagerResponse = await visitManagerGateway.findEstablishment(req.params.establishmentId)
    pipelineResponse(visitManagerResponse, res)
  };

  const add = async (req, res, next) => {
    let visitManagerResponse = await visitManagerGateway.addEstablishment(req.body)
    pipelineResponse(visitManagerResponse, res)
  };

  const update = async (req, res, next) => {
    establishmentId = req.params.establishmentId;
    let visitManagerResponse = await visitManagerGateway.updateEstablishment(establishmentId, req.body)
    pipelineResponse(visitManagerResponse, res)
  };

  const remove = async (req, res, next) => {
    let visitManagerResponse = await visitManagerGateway.deleteEstablishment(req.params.establishmentId)
    pipelineResponse(visitManagerResponse, res)
  };

  return {
    add,
    get,
    getSingleEstablishment,
    update,
    remove
  };
};
