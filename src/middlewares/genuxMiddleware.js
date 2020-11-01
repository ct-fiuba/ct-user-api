const got = require('got');

module.exports = function genuxMiddleware() {
  const authServerClient = got.extend({
    prefixUrl: process.env.AUTH_SERVER_URL
  });

  return (req, res, next) => {
    authServerClient.post('useGenuxToken', {
      json: { genuxToken: req.body.genuxToken }
    })
      .then(result => next())
      .catch(err => {
        console.error(err.response.statusCode, err.response.body);
        res.status(err.response.statusCode).json(err.response.body);
      });
  }
};
