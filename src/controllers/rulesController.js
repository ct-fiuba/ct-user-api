const pipelineResponse = require('./utils');

module.exports = function rulesController(virusTrackerGateway) {
  const add = async (req, res, next) => {
    let virusTrackerResponse = await virusTrackerGateway.addRules(req.body)
    pipelineResponse(virusTrackerResponse, res)
  };

  const getSingleRule = async (req, res, next) => {
    let virusTrackerResponse = await virusTrackerGateway.findRule(req.params.ruleId)
    pipelineResponse(virusTrackerResponse, res)
  };

  const get = async (req, res, next) => {
    let virusTrackerResponse = await virusTrackerGateway.findRules()
    pipelineResponse(virusTrackerResponse, res)
  };

  const update = async (req, res, next) => {
    let virusTrackerResponse = await virusTrackerGateway.updateRules(req.body)
    pipelineResponse(virusTrackerResponse, res)
  };

  const remove = async (req, res, next) => {
    let virusTrackerResponse = await virusTrackerGateway.deleteRules(req.body)
    pipelineResponse(virusTrackerResponse, res)
  };

  return {
    add,
    get,
    getSingleRule,
    remove,
    update
  };
};
