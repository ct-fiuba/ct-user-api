const pipelineResponse = (stream, res) => {
  stream.on('error', (error) => {
    res.statusCode = error.response.statusCode;
    res.json(JSON.parse(error.response.body)).end();
  });

  stream.pipe(res);
}

module.exports = function visitsController(visitManagerGateway) {
  const get = async (req, res, next) => {
    let filters = req.query;
    let visitManagerResponse = await visitManagerGateway.findVisits(filters)
    pipelineResponse(visitManagerResponse, res)
  };

  const add = async (req, res, next) => {
    let visitManagerResponse = await visitManagerGateway.addVisit(req.body)
    pipelineResponse(visitManagerResponse, res)
  };

  return {
    add,
    get
  };
};
