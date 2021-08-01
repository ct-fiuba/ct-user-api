const pipelineResponse = require('./utils');

module.exports = function establishmentsController(codesWhispererGateway) {
  const get = async (req, res, next) => {
    let filters = req.query;
    let response = await codesWhispererGateway.getBillboard(filters)
    pipelineResponse(response, res)
  };

  return {
    get,
  };
};
