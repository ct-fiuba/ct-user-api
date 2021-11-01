const pipelineResponse = require('./utils');

module.exports = function vaccinesController(virusTrackerGateway) {
  const add = async (req, res, next) => {
    let virusTrackerResponse = await virusTrackerGateway.addVaccine(req.body)
    pipelineResponse(virusTrackerResponse, res)
  };

  const get = async (req, res, next) => {
    let virusTrackerResponse = await virusTrackerGateway.findVaccines()
    pipelineResponse(virusTrackerResponse, res)
  };

  const update = async (req, res, next) => {
    let virusTrackerResponse = await virusTrackerGateway.updateVaccine(req.body)
    pipelineResponse(virusTrackerResponse, res)
  };

  const remove = async (req, res, next) => {
    let virusTrackerResponse = await virusTrackerGateway.deleteVaccine(req.body)
    pipelineResponse(virusTrackerResponse, res)
  };

  return {
    add,
    get,
    remove,
    update
  };
};
