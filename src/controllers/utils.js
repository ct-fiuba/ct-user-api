module.exports = function pipelineResponse(stream, res) {
    stream.on('error', (error) => {
      res.statusCode = error.response.statusCode;
      res.json(JSON.parse(error.response.body)).end();
    });
  
    stream.pipe(res);
  }