const got = require('got');

const usersAuthenticationMiddleware = () => {
  return validateAccessToken('users');
};

const ownersAuthenticationMiddleware = () => {
  return validateAccessToken('owners');
};

const adminsAuthenticationMiddleware = () => {
  return validateAccessToken('admins');
};

const validateAccessToken = (role) => {
  const authServerClient = got.extend({
    prefixUrl: process.env.AUTH_SERVER_URL
  });

  return (req, res, next) => {
    const token = req.headers['access-token'];
    if (!token) {
      return res.status(400).json({ reason: 'Missing access token' });
    }

    authServerClient.post(`${role}/validateaccesstoken`, {
      json: { accessToken: token }
    })
      .then(result => next())
      .catch(err => {
        console.error(err.response.statusCode, err.response.body);
        res.status(401).json(err.response.body);
      });
  }
}

const genuxMiddleware = () => {
  const authServerClient = got.extend({
    prefixUrl: process.env.AUTH_SERVER_URL
  });

  return (req, res, next) => {
    const token = req.headers['genux-token'];

    if (!token) {
      return res.status(400).json({ reason: 'Missing genux token' });
    }

    authServerClient.post('useGenuxToken', {
      json: { genuxToken: token }
    })
      .then(result => next())
      .catch(err => {
        console.error(err.response.statusCode, err.response.body);
        res.status(err.response.statusCode).json(err.response.body);
      });
  }
};

module.exports = {
  usersAuthenticationMiddleware: usersAuthenticationMiddleware(),
  ownersAuthenticationMiddleware: ownersAuthenticationMiddleware(),
  adminsAuthenticationMiddleware: adminsAuthenticationMiddleware(),
  genuxMiddleware: genuxMiddleware()
};
