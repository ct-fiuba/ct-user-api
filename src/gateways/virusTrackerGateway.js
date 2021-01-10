const got = require('got');

module.exports = function virusTrackerGateway() {

  const virusTrackerAPI = got.extend({
    prefixUrl: process.env.VIRUS_TRACKER_URL
  });

  const addInfected = async infectedInfo => {
    return virusTrackerAPI.stream.post('infected', { json: infectedInfo });
  };

  return {
    addInfected
  };
};
