const app = require('../../src/app')();
const request = require('supertest');
const nock = require('nock');

let server;
let establishment_id1 = 1;
let token = 'someToken';
let invalidToken = 'badToken';

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
    openPlace: false,
    n95Mandatory: false
  },
  {
    name: "Terraza",
    hasExit: false,
    m2: "400",
    openPlace: true,
    n95Mandatory: false
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
    openPlace: false,
    n95Mandatory: false
  },
  {
    name: "Terraza",
    hasExit: false,
    m2: "400",
    openPlace: true,
    n95Mandatory: false
  }
];

let validGenuxToken = "validGenuxToken"
let invalidGenuxToken = "invalidGenuxToken"


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
    .post('/validateaccesstoken', { accessToken: token })
    .reply(200, { data: "Some data" })
    .post('/validateaccesstoken', { accessToken: invalidToken })
    .reply(401, { data: "Unauthorized!" })
    .post('/validateaccesstoken')
    .reply(400, { reason: "Error!" })
    .post('/useGenuxToken', { genuxToken: validGenuxToken })
    .reply(200)
    .post('/useGenuxToken', { genuxToken: invalidGenuxToken })
    .reply(404);
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

      test('should fail if using invalid token', async () => {
        await request(server).get('/establishments').set('access-token', invalidToken).then(res => {
          expect(res.status).toBe(401);
        });
      });

      test('should fail if not sending token', async () => {
        await request(server).get('/establishments').then(res => {
          expect(res.status).toBe(400);
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

      describe('add visits', () => {
        const visit = {
          scanCode: "SCANCODE1234",
          userGeneratedCode: "QWER1234YUIO",
          timestamp: Date.now(),
          vaccinated: 0,
          covidRecovered: false
        };

        const invalidVisit = {
          scanCode: "SCANCODE1234",
          userGeneratedCode: "QWER1234YUIO",
          timestamp: Date.now(),
          vaccinated: 0,
          covidRecovered: false
        };

        beforeEach(() => {
          nock(process.env.VISIT_MANAGER_URL)
          .post('/visits', visit)
          .reply(201);
        });

        test('adding a visit should return 201', async () => {
          await request(server).post('/visits').set('genux-token', validGenuxToken).send(visit).expect(201);
        });

        test('adding a visit with invalid genux token should return 404', async () => {
          await request(server).post('/visits').set('genux-token', invalidGenuxToken).send(invalidVisit).expect(404);
        });
      });

      describe('add infected', () => {
        const visit1 = {
          userGeneratedCode: "QWER1234YUIO",
        };

        beforeEach(() => {
          nock(process.env.VIRUS_TRACKER_URL)
          .post('/infected', visit1)
          .reply(201);
        });

        test('adding an infected should return 201', async () => {
          await request(server).post('/infected').set('genux-token', validGenuxToken).set('access-token', token).send(visit1).expect(201);
        });
      });

      describe('rules', () => {
        let ruleHighRisk = {
          "index": 1,
          "contagionRisk": "Alto",
          "m2Value": 10,
          "m2Cmp": "<"
        }

        let highRiskId = "60391d320720270014d0a082";

        let ruleHighRiskResponse = {
          "_id": highRiskId,
          "index": 1,
          "contagionRisk": "Alto",
          "m2Value": 10,
          "m2Cmp": "<"
        }

        let ruleMidRisk = {
          "index": 2,
          "contagionRisk": "Medio",
          "m2Value": 10,
          "m2Cmp": ">"
        }

        let midRiskId = "60391d320720270014d0a081";

        let ruleMidRiskResponse = {
          "_id": midRiskId,
          "index": 2,
          "contagionRisk": "Medio",
          "m2Value": 10,
          "m2Cmp": ">"
        }

        describe('add rule', () => {
          beforeEach(() => {
            nock(process.env.VIRUS_TRACKER_URL)
            .post('/rules', { rules: [ruleHighRisk]})
            .reply(201, {rules: [ruleHighRiskResponse]})
            .post('/rules', { rules: [ruleMidRisk]})
            .reply(201, {rules: [ruleMidRiskResponse]})
            .post('/rules', { rules: [ruleHighRisk, ruleMidRisk]})
            .reply(201, {rules: [ruleHighRiskResponse, ruleMidRiskResponse]})
          });

          test('add single rule should return 201', async () => {
            await request(server).post('/rules').send({ rules: [ruleHighRisk] }).expect(201);
          });

          test('add two rules should return 201', async () => {
            await request(server).post('/rules').send({ rules: [ruleHighRisk, ruleMidRisk] }).expect(201);
          });
        });

        describe('get rules', () => {
          beforeEach(() => {
            nock(process.env.VIRUS_TRACKER_URL)
            .get('/rules')
            .reply(200, [ruleHighRiskResponse, ruleMidRiskResponse])
            .get(`/rules/${highRiskId}`)
            .reply(200, ruleHighRiskResponse)
            .get(`/rules/${midRiskId}`)
            .reply(200, ruleMidRiskResponse)
          });

          test('should return all rules', async () => {
            await request(server).get('/rules').then(res => {
              expect(res.status).toBe(200);
              expect(res.body).toHaveLength(2);
            });
          });

          test('should return high risk rule', async () => {
            await request(server).get(`/rules/${highRiskId}`).then(res => {
              expect(res.status).toBe(200);
              expect(res.body._id).toBe(highRiskId);
              expect(res.body.index).toBe(ruleHighRisk.index);
              expect(res.body.contagionRisk).toBe(ruleHighRisk.contagionRisk);
              expect(res.body.m2Value).toBe(ruleHighRisk.m2Value);
              expect(res.body.m2Cmp).toBe(ruleHighRisk.m2Cmp);
            });
          });

          test('should return mid risk rule', async () => {
            await request(server).get(`/rules/${midRiskId}`).then(res => {
              expect(res.status).toBe(200);
              expect(res.body._id).toBe(midRiskId);
              expect(res.body.index).toBe(ruleMidRisk.index);
              expect(res.body.contagionRisk).toBe(ruleMidRisk.contagionRisk);
              expect(res.body.m2Value).toBe(ruleMidRisk.m2Value);
              expect(res.body.m2Cmp).toBe(ruleMidRisk.m2Cmp);
            });
          });
        });

        describe('delete rules', () => {
          beforeEach(() => {
            nock(process.env.VIRUS_TRACKER_URL)
            .delete('/rules', { ruleIds: [highRiskId]})
            .reply(204)
            .delete('/rules', { ruleIds: [midRiskId]})
            .reply(204)
            .delete('/rules', { ruleIds: [highRiskId, midRiskId]})
            .reply(204)
          });

          test('should delete high risk rule', async () => {
            await request(server).delete('/rules').send({ ruleIds: [highRiskId] }).then(res => {
              expect(res.status).toBe(204);
            });
          });

          test('should delete mid risk rule', async () => {
            await request(server).delete('/rules').send({ ruleIds: [midRiskId] }).then(res => {
              expect(res.status).toBe(204);
            });
          });

          test('should delete both rules', async () => {
            await request(server).delete('/rules').send({ ruleIds: [highRiskId, midRiskId] }).then(res => {
              expect(res.status).toBe(204);
            });
          });
        });

        describe('update rules', () => {
          let ruleHighRiskUpdated = {
            "index": 2,
            "contagionRisk": "Alto",
            "m2Value": 10,
            "m2Cmp": "<"
          }

          let ruleMidRiskUpdated = {
            "index": 1,
            "contagionRisk": "Medio",
            "m2Value": 10,
            "m2Cmp": ">"
          }

          let ruleHighRiskUpdatedResponse = {
            "_id": highRiskId,
            "index": 2,
            "contagionRisk": "Alto",
            "m2Value": 10,
            "m2Cmp": "<"
          }

          let ruleMidRiskUpdatedResponse = {
            "_id": midRiskId,
            "index": 1,
            "contagionRisk": "Medio",
            "m2Value": 10,
            "m2Cmp": ">"
          }

          beforeEach(() => {
            nock(process.env.VIRUS_TRACKER_URL)
            .put('/rules', { rules: [ruleHighRiskUpdated, ruleMidRiskUpdated]})
            .reply(200, [ruleHighRiskUpdatedResponse, ruleMidRiskUpdatedResponse])
          });

          test('should update the indexes', async () => {
            let aux = ruleHighRisk.index;
            ruleHighRisk.index = ruleMidRisk.index;
            ruleMidRisk.index = aux;
            await request(server).put('/rules').send({ rules: [ruleHighRisk, ruleMidRisk] }).then(res => {
              expect(res.status).toBe(200);
            });
          });
        });
      });
    });
  });
});
