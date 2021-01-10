const pipelineResponse = (stream, res) => {
  stream.on('error', (error) => {
    res.statusCode = error.response.statusCode;
    res.json(JSON.parse(error.response.body)).end();
  });

  stream.pipe(res);
}

module.exports = function infectedController(virusTrackerGateway) {
  const add = async (req, res, next) => {
    let virusTrackerResponse = await virusTrackerGateway.addInfected(req.body)
    pipelineResponse(virusTrackerResponse, res)
  };

  return {
    add
  };
};
