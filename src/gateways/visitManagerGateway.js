const got = require('got');

module.exports = function visitManagerGateway() {

  const visitManagerAPI = got.extend({
    prefixUrl: process.env.VISIT_MANAGER_URL
  });

  const findEstablishments = async filters => {
    return visitManagerAPI.stream.get('establishments', { searchParams: filters })
  };

  const findEstablishmentsByOwner = async ownerId => {
    return visitManagerAPI.stream.get(`establishments/owner/${ownerId}`);
  };

  const findEstablishment = async establishmentId => {
    return visitManagerAPI.stream.get(`establishments/${establishmentId}`);
  };

  const getEstablishmentPDF = async establishmentId => {
    return visitManagerAPI.stream.get(`establishments/PDF/${establishmentId}`);
  };

  const getSingleSpacePDF = async (establishmentId, spaceId) => {
    return visitManagerAPI.stream.get(`establishments/PDF/${establishmentId}/space/${spaceId}`);
  };

  const addEstablishment = async establishmentInfo => {
    return visitManagerAPI.stream.post('establishments', { json: establishmentInfo });
  };

  const addSingleSpace = async spaceInfo => {
    return visitManagerAPI.stream.post('establishments/space', { json: spaceInfo });
  };

  const updateEstablishment = async (establishmentId, establishmentInfo) => {
    return visitManagerAPI.stream.put(`establishments/${establishmentId}`, { json: establishmentInfo });
  };

  const updateSpace = async (spaceId, spaceInfo) => {
    return visitManagerAPI.stream.put(`establishments/space/${spaceId}`, { json: spaceInfo });
  };

  const deleteEstablishment = async establishmentId => {
    return visitManagerAPI.stream.delete(`establishments/${establishmentId}`);
  };

  const addVisit = async visitInfo => {
    return visitManagerAPI.stream.post('visits', { json: visitInfo });
  };

  return {
    findEstablishments,
    findEstablishmentsByOwner,
    findEstablishment,
    getEstablishmentPDF,
    getSingleSpacePDF,
    addEstablishment,
    addSingleSpace,
    updateEstablishment,
    updateSpace,
    deleteEstablishment,
    addVisit
  };
};
