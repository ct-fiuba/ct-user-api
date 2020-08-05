const app = require('../../src/app')();
const request = require('supertest');
const nock = require('nock');

let server;

let type1 = 'restaurant';
let name1 = 'Mc Donalds';
let email1 = 'mcdonalds@gmail.com';
let address1 = 'Cabildo 1010';
let city = 'CABA';
let province = 'CABA';
let zip = '1430ACV';
let country = 'Argentina';
let QRs1 = ['ASDF1234', 'QWER4563'];

let type2 = 'supermarket';
let name2 = 'Coto';
let email2 = 'coto@gmail.com';
let address2 = 'Cabildo 2020';
let QRs2 = ['POU034F', 'ZXCV4567'];

beforeAll(async () => {
  server = await app.listen(5006);
});

afterAll((done) => {
  server.close(done)
});

describe('App test', () => {
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
      QRs: QRs1
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
      QRs: QRs2
    };

    describe.skip('add first establishments', () => {
      beforeEach(() => {
        const scope = nock('http://localhost:5005')
        .post('/establishments', correctEstablishment1)
        .reply(201);
      });

      test('should return 201', async () => {
        await request(server).post('/establishments').send(correctEstablishment1).expect('Content-Type', /json/).expect(201);
      });
    });

    describe.skip('add second establishments', () => {
      beforeEach(() => {
        const scope = nock('http://localhost:5005')
        .post('/establishments', correctEstablishment2)
        .reply(201);
      });

      test('should return 201', async () => {
        await request(server).post('/establishments').send(correctEstablishment2).expect('Content-Type', /json/).expect(201);
      });
    });

    describe('get establishments', () => {
      beforeEach(() => {
        nock('http://localhost:5005')
        .get('/establishments')
        .reply(200, [correctEstablishment1, correctEstablishment2]);
      });
      test('should return all establishments', async () => {
        await request(server).get('/establishments').then(res => {
          expect(res.status).toBe(200);
          expect(res.body).toHaveLength(2);
        });
      });
    });

    describe('get matching establishments', () => {
      beforeEach(() => {
        nock('http://localhost:5005')
        .get('/establishments?type=restaurant')
        .reply(200, correctEstablishment1);
      });

      describe('by type', () => {
        test('when restaurant, should return only restaurant establishment', async () => {
          await request(server).get('/establishments?type=restaurant').then(res => {
            expect(res.status).toBe(200);
            expect(res.body).toStrictEqual(correctEstablishment1);
          });
        });
      });

      describe('by name', () => {
        beforeEach(() => {
          nock('http://localhost:5005')
          .get('/establishments?name=Coto')
          .reply(200, correctEstablishment2);
        });

        test('when full match, should return that establishment', async () => {
          await request(server).get('/establishments?name=Coto').then(res => {
            expect(res.status).toBe(200);
            expect(res.body).toStrictEqual(correctEstablishment2);
          });
        });
      });
    });
  });
});
