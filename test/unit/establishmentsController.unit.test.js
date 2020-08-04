const establishmentsControllerFactory = require('../../src/controllers/establishmentsController');

let req;
let res;
let next;

let id = 1;
let type = 'restaurant';
let name = 'Mc Donalds';
let email = 'mcdonalds@gmail.com';
let address = 'Cabildo 1010';
let city = 'CABA';
let province = 'CABA';
let zip = '1430ACV';
let country = 'Argentina';
let QRs = ['ASDF1234', 'QWER4563'];

beforeEach(() => {
  visitManagerGateway = {
    findEstablishments: jest.fn(),
    findEstablishment: jest.fn(),
    addEstablishment: jest.fn(),
    updateEstablishment: jest.fn(),
    deleteEstablishment: jest.fn()
  };
  establishmentsController = establishmentsControllerFactory(visitManagerGateway);
  req = {
    body: {},
    params: {},
    query: {}
  };
  res = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
    json: jest.fn()
  };
  next = jest.fn();
});

const exampleEstablishment = {
  id,
  type,
  name,
  email,
  address,
  city,
  province,
  zip,
  country,
  QRs
};

describe('get', () => {
  describe('when establishments are retrieved', () => {
    beforeEach(() => {
      req.query = { name };
      visitManagerGateway.findEstablishments.mockResolvedValue([exampleEstablishment]);
    });

    test('should respond successfully', async () => {
      await establishmentsController.get(req, res, next);
      expect(visitManagerGateway.findEstablishments).toHaveBeenCalledWith({name});
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([exampleEstablishment]);
    });
  });
});

describe('getSingleEstablishment', () => {
  describe('when a establishment is retrieved', () => {
    beforeEach(() => {
      req.params = { establishmentId: id };
      visitManagerGateway.findEstablishment.mockResolvedValue(exampleEstablishment);
    });

    test('should respond successfully', async () => {
      await establishmentsController.getSingleEstablishment(req, res, next);
      expect(visitManagerGateway.findEstablishment).toHaveBeenCalledWith(id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(exampleEstablishment);
    });
  });

  describe('when an inexistent establishment is retrieved', () => {
    beforeEach(() => {
      req.params = { establishmentId: id };
      visitManagerGateway.findEstablishment.mockResolvedValue(null);
    });

    test('should respond successfully', async () => {
      await establishmentsController.getSingleEstablishment(req, res, next);
      expect(visitManagerGateway.findEstablishment).toHaveBeenCalledWith(id);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ reason: 'Establishment not found' });
    });
  });
});


describe('add', () => {
  describe('when a correct establishment is added', () => {
    beforeEach(() => {
      req.body = exampleEstablishment;
      visitManagerGateway.establishmentExists.mockResolvedValue(null);
      visitManagerGateway.addEstablishment.mockResolvedValue(exampleEstablishment);
    });

    test('should respond successfully', async () => {
      await establishmentsController.add(req, res, next);
      expect(visitManagerGateway.establishmentExists).toHaveBeenCalledWith(exampleEstablishment);
      expect(visitManagerGateway.addEstablishment).toHaveBeenCalledWith(exampleEstablishment);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id: exampleEstablishment.id });
    });
  });

  describe('when a establishment is already registered', () => {
    beforeEach(() => {
      req.body = exampleEstablishment;
      visitManagerGateway.establishmentExists.mockResolvedValue(exampleEstablishment);
    });

    test('should respond with conflict', async () => {
      await establishmentsController.add(req, res, next);
      expect(visitManagerGateway.establishmentExists).toHaveBeenCalledWith(exampleEstablishment);
      expect(visitManagerGateway.addEstablishment).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ reason: 'Establishment already registered' });
    });
  });

  describe('when there is a DB error', () => {
    beforeEach(() => {
      req.body = exampleEstablishment;
      visitManagerGateway.establishmentExists.mockRejectedValue(new Error('crash!'));
    });

    test('should respond with internal error', async () => {
      await establishmentsController.add(req, res, next);
      expect(visitManagerGateway.establishmentExists).toHaveBeenCalledWith(exampleEstablishment);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ reason: 'DB Error' });
    });
  });
});


describe('update', () => {
  const newData = {
    name,
    type
  };

  describe('when a establishment is correctly updated', () => {
    beforeEach(() => {
      req.params = { establishmentId: id };
      req.body = newData;
      visitManagerGateway.updateEstablishment.mockResolvedValue({ n: 1 });
      visitManagerGateway.findEstablishment.mockResolvedValue(exampleEstablishment);
    });

    test('should respond successfully', async () => {
      await establishmentsController.update(req, res, next);
      expect(visitManagerGateway.updateEstablishment).toHaveBeenCalledWith(id, newData);
      expect(visitManagerGateway.findEstablishment).toHaveBeenCalledWith(id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(exampleEstablishment);
    });
  });

  describe('when an inexisten establishment is updated', () => {
    beforeEach(() => {
      req.params = { establishmentId: id };
      req.body = newData;
      visitManagerGateway.updateEstablishment.mockResolvedValue({ n: 0 });
    });

    test('should respond successfully', async () => {
      await establishmentsController.update(req, res, next);
      expect(visitManagerGateway.updateEstablishment).toHaveBeenCalledWith(id, newData);
      expect(visitManagerGateway.findEstablishment).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ reason: 'Establishment not found' });
    });
  });
});


describe('remove', () => {
  describe('when an existing establishment is removed', () => {
    beforeEach(() => {
      req.params = { establishmentId: id };
      visitManagerGateway.deleteEstablishment.mockResolvedValue({ deletedCount: 1 });
    });

    test('should respond successfully', async () => {
      await establishmentsController.remove(req, res, next);
      expect(visitManagerGateway.deleteEstablishment).toHaveBeenCalledWith(id);
      expect(res.status).toHaveBeenCalledWith(204);
    });
  });

  describe('when an inexisting establishment is removed', () => {
    beforeEach(() => {
      req.params = { establishmentId: id };
      visitManagerGateway.deleteEstablishment.mockResolvedValue({ deletedCount: 0 });
    });

    test('should respond successfully', async () => {
      await establishmentsController.remove(req, res, next);
      expect(visitManagerGateway.deleteEstablishment).toHaveBeenCalledWith(id);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ reason: 'Establishment not found' });
    });
  });
});