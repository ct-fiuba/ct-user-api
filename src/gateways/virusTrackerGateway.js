const got = require('got');

module.exports = function virusTrackerGateway() {

  const virusTrackerAPI = got.extend({
    prefixUrl: process.env.VIRUS_TRACKER_URL
  });

  const addInfected = async infectedInfo => {
    return virusTrackerAPI.stream.post('infected', { json: infectedInfo });
  };virusTrackerGateway

  const addRules = async rulesInfo => {
    return virusTrackerAPI.stream.post('rules', { json: rulesInfo });
  };

  const findRules = async () => {
    return virusTrackerAPI.stream.get('rules');
  };

  const findRule = async ruleId => {
    return virusTrackerAPI.stream.get(`rules/${ruleId}`);
  };

  const updateRules = async rulesInfo => {
    return virusTrackerAPI.stream.put(`rules`, { json: rulesInfo });
  };

  const deleteRules = async (rulesInfo) => {
    return virusTrackerAPI.stream.delete(`rules`, { json: rulesInfo });
  };

  const addVaccine = async vaccineInfo => {
    return virusTrackerAPI.stream.post('vaccines', { json: vaccineInfo });
  };

  const findVaccines = async () => {
    return virusTrackerAPI.stream.get('vaccines');
  };

  const updateVaccine = async (vaccineId, vaccineInfo) => {
    return virusTrackerAPI.stream.put(`vaccines/${vaccineId}`, { json: vaccineInfo });
  };

  const deleteVaccine = async (vaccineId, vaccineInfo) => {
    return virusTrackerAPI.stream.delete(`vaccines/${vaccineId}`, { json: vaccineInfo });
  };

  return {
    addInfected,
    addRules,
    findRules,
    findRule,
    updateRules,
    deleteRules,
    addVaccine,
    findVaccines,
    updateVaccine,
    deleteVaccine
  };
};
