const got = require('got');

module.exports = function visitManagerGateway() {

  const visitManagerAPI = got.extend({
    prefixUrl: process.env.CODES_WHISPERER_URL
  });

  const getBillboard = async filters => {
    return visitManagerAPI.stream.get('billboard', { searchParams: filters })
  };

  return {
    getBillboard
  };
};
