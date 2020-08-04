const got = require('got');

module.exports = function visitManagerGateway() {

  const visitManagerAPI = got.extend({
		prefixUrl: 'http://localhost:5005'
	});

  const findEstablishments = async filters => {
    return visitManagerAPI.stream.get('establishments', { searchParams: filters })
  };

  const findEstablishment = async establishmentId => {
    return visitManagerAPI.stream.get(`establishments/${establishmentId}`);
  };

  const addEstablishment = async establishmentInfo => {
    return visitManagerAPI.stream.post('establishments', { body: establishmentInfo });
  };

  const updateEstablishment = async (establishmentId, establishmentInfo) => {
    return visitManagerAPI.stream.put(`establishments/${establishmentId}`, establishmentInfo);
  };

  const deleteEstablishment = async establishmentId => {
    return visitManagerAPI.stream.delete(`establishments/${establishmentId}`);
  };

  return {
    findEstablishments,
    findEstablishment,
    addEstablishment,
    updateEstablishment,
    deleteEstablishment
  };
};
