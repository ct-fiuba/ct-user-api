const got = require('got');

const authenticationMiddleware = () => {
  const authServerClient = got.extend({
    prefixUrl: process.env.AUTH_SERVER_URL
  });

  return (req, res, next) => {
    const token = req.headers['access-token'];
    if (!token) {
      return res.status(400).json({ reason: 'Missing access token' });
    }

    authServerClient.post('validateaccesstoken', {
      json: { accessToken: token }
    })
      .then(result => next())
      .catch(err => {
        console.error(err.response.statusCode, err.response.body);
        res.status(401).json(err.response.body);
      });
  }
};

const genuxMiddleware = () => {
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

module.exports = {
  authenticationMiddleware,
  genuxMiddleware
};
