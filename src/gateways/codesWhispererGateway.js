const got = require('got');

module.exports = function visitManagerGateway() {

  const codesWhispererAPI = got.extend({
    prefixUrl: process.env.CODES_WHISPERER_URL
  });

  const getBillboard = async filters => {
    return codesWhispererAPI.stream.get('billboard', { searchParams: filters })
  };

  return {
    getBillboard
  };
};
