const app = require('../../src/app')();
const request = require('supertest');
const nock = require('nock');

let server;
let establishment_id1 = 1;
let token = 'someToken';

let type1 = 'restaurant';
let name1 = 'Mc Donalds';
let email1 = 'mcdonalds@gmail.com';
let address1 = 'Cabildo 1010';
let city = 'CABA';
let province = 'CABA';
let zip = '1430ACV';
let country = 'Argentina';
let spaces1 = [
  {
    name: "Primer piso",
    hasExit: true,
    m2: "1000",
    openPlace: false
  },
  {
    name: "Terraza",
    hasExit: false,
    m2: "400",
    openPlace: true
  }
];

let type2 = 'supermarket';
let name2 = 'Coto';
let email2 = 'coto@gmail.com';
let address2 = 'Cabildo 2020';
let spaces2 = [
  {
    name: "Primer piso",
    hasExit: true,
    m2: "1000",
    openPlace: false
  },
  {
    name: "Terraza",
    hasExit: false,
    m2: "400",
    openPlace: true
  }
];


beforeAll(async () => {
  server = await app.listen(process.env.PORT);
});

afterAll((done) => {
  server.close(done);
  afterAll(nock.restore);
});

describe('App test', () => {
  beforeEach(() => {
    nock(process.env.AUTH_SERVER_URL)
    .post('/validateaccesstoken')
    .reply(200, { data: "Some data" });
  });
  
  afterEach(nock.cleanAll);
  
  describe('ping', () => {
    test('should return 200', async () => {
      await request(server).get('/ping').expect(200);
    });
  });

  describe('establishments', () => {
    const correctEstablishment1 = {
      type: type1,
      name: name1,
      email: email1,
      address: address1,
      city,
      province,
      zip,
      country,
      spaces: spaces1
    };
    const correctEstablishment2 = {
      type: type2,
      name: name2,
      email: email2,
      address: address2,
      city,
      province,
      zip,
      country,
      spaces: spaces2
    };

    describe('add first establishment success', () => {
      beforeEach(() => {
        nock(process.env.VISIT_MANAGER_URL)
        .post('/establishments', correctEstablishment1)
        .reply(201);
      });

      test('should return 201', async () => {
        await request(server).post('/establishments').send(correctEstablishment1).expect(201);
      });
    });

    describe('add establishment failure', () => {
      beforeEach(() => {
        nock(process.env.VISIT_MANAGER_URL)
        .post('/establishments')
        .reply(400, {reason:"Missing value"});
      });

      test('should forward the error', async () => {
        await request(server).post('/establishments').then(res => {
          expect(res.status).toBe(400);
          expect(res.body).toStrictEqual({reason:"Missing value"});
        });
      });
    });

    describe('add second establishment success', () => {
      beforeEach(() => {
        nock(process.env.VISIT_MANAGER_URL)
        .post('/establishments', correctEstablishment2)
        .reply(201);
      });

      test('should return 201', async () => {
        await request(server).post('/establishments').send(correctEstablishment2).expect(201);
      });
    });

    describe('get establishments', () => {
      beforeEach(() => {
        nock(process.env.VISIT_MANAGER_URL)
        .get('/establishments')
        .reply(200, [correctEstablishment1, correctEstablishment2]);
      });
      test('should return all establishments', async () => {
        await request(server).get('/establishments').set('access-token', token).then(res => {
          expect(res.status).toBe(200);
          expect(res.body).toHaveLength(2);
        });
      });
    });

    describe('get matching establishments', () => {
      beforeEach(() => {
        nock(process.env.VISIT_MANAGER_URL)
        .get('/establishments?type=restaurant')
        .reply(200, correctEstablishment1);
      });

      describe('by type', () => {
        test('when restaurant, should return only restaurant establishment', async () => {
          await request(server).get('/establishments?type=restaurant').set('access-token', token).then(res => {
            expect(res.status).toBe(200);
            expect(res.body).toStrictEqual(correctEstablishment1);
          });
        });
      });

      describe('by name', () => {
        beforeEach(() => {
          nock(process.env.VISIT_MANAGER_URL)
          .get('/establishments?name=Coto')
          .reply(200, correctEstablishment2);
        });

        test('when full match, should return that establishment', async () => {
          await request(server).get('/establishments?name=Coto').set('access-token', token).then(res => {
            expect(res.status).toBe(200);
            expect(res.body).toStrictEqual(correctEstablishment2);
          });
        });
      });

      describe('get PDF file', () => {
        beforeEach(() => {
          nock(process.env.VISIT_MANAGER_URL)
          .get(`/establishments/PDF/${establishment_id1}`)
          .reply(200, {}, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment'
          });
        });

        test('should get a PDF document in the response', async () => {
          await request(server).get(`/establishments/PDF/${establishment_id1}`).set('access-token', token).then(res => {
            expect(res.status).toBe(200);
            expect(res.header['content-type']).toBe('application/pdf');
            expect(res.header['content-disposition']).toContain('attachment');
          });
        });
      });
    });
  });
});
