const pipelineResponse = require('./utils');

module.exports = function infectedController(virusTrackerGateway) {
  const add = async (req, res, next) => {
    let virusTrackerResponse = await virusTrackerGateway.addInfected(req.body)
    pipelineResponse(virusTrackerResponse, res)
  };

  return {
    add
  };
};
