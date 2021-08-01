const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./static/swagger.json');
const establishmentsRouter = require('./routes/establishmentsRouter');
const visitsRouter = require('./routes/visitsRouter');
const infectedRouter = require('./routes/infectedRouter');
const rulesRouter = require('./routes/rulesRouter');
const monitoringRouter = require('./routes/monitoringRouter');
const billboardRouter = require('./routes/billboardRouter');

module.exports = function app() {
  const app = express();
  app.use(cors());

  app.disable('x-powered-by');
  app.use(bodyParser.json());
  app.use(establishmentsRouter());
  app.use(visitsRouter());
  app.use(infectedRouter());
  app.use(rulesRouter());
  app.use(billboardRouter())
  app.use(monitoringRouter());
  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  return app;
};
