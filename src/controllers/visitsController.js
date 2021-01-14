const pipelineResponse = require('./utils');

module.exports = function visitsController(visitManagerGateway) {
  const add = async (req, res, next) => {
    let visitManagerResponse = await visitManagerGateway.addVisit(req.body)
    pipelineResponse(visitManagerResponse, res)
  };

  return {
    add
  };
};
