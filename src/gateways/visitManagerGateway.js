const got = require('got');

module.exports = function visitManagerGateway() {

  const visitManagerAPI = got.extend({
    prefixUrl: process.env.VISIT_MANAGER_URL
  });

  const findEstablishments = async filters => {
    return visitManagerAPI.stream.get('establishments', { searchParams: filters })
  };

  const findEstablishment = async establishmentId => {
    return visitManagerAPI.stream.get(`establishments/${establishmentId}`);
  };

  const getEstablishmentPDF = async establishmentId => {
    return visitManagerAPI.stream.get(`establishments/PDF/${establishmentId}`);
  };

  const addEstablishment = async establishmentInfo => {
    return visitManagerAPI.stream.post('establishments', { json: establishmentInfo });
  };

  const updateEstablishment = async (establishmentId, establishmentInfo) => {
    return visitManagerAPI.stream.put(`establishments/${establishmentId}`, { json: establishmentInfo });
  };

  const deleteEstablishment = async establishmentId => {
    return visitManagerAPI.stream.delete(`establishments/${establishmentId}`);
  };

  const addVisit = async visitInfo => {
    return visitManagerAPI.stream.post('visits', { json: visitInfo });
  };

  const findVisits = async filters => {
    return visitManagerAPI.stream.get('visits', { searchParams: filters })
  };

  return {
    findEstablishments,
    findEstablishment,
    getEstablishmentPDF,
    addEstablishment,
    updateEstablishment,
    deleteEstablishment,
    addVisit,
    findVisits
  };
};
