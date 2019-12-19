
const chai = require("chai");
const chaiHttp = require("chai-http");
const faker = require('faker');
const should = chai.should();
const app = require('../app');
const { Categories } = require('../models');
chai.use(chaiHttp);
const agent = chai.request.agent(app);
// let token = '';

global.token = '';

process.env.NODE_ENV = 'test';

describe('RUN TESTS', () => {
  describe('AUTH SIGNIN', () => {
    it('Sign in admin', done => {
      agent.post('/api/v1/auth/signin')
      .send({ phone: '+998123123123', password: 'pageup16' })
      .end((err, res) => {
        should.not.exist(err);
        res.should.to.have.status(200);
        res.body.should.to.be.an('object');
        res.body.token.should.to.be.a('string');
        res.body.ok.should.to.be.true;
        token = res.body.token;
        done();
      });
    });
  });
  describe('CATEGORIES', () => {
    let categories = [];
    describe('POST /categories', () => {

      beforeEach(done => {
        Categories.truncate({ cascade: true }).then(() => {
          done();
        });
      });
    
      it('Create categories in DB', done => {
        let createdLength = 10;
        for (let i = 0; i < createdLength; i++) {
          agent.post('/api/v1/categories')
            .set('x-access-token', token)
            .send({ name: faker.hacker.noun(), parent: 0 })
            .end((err, res) => {
              should.not.exist(err);
              res.should.to.have.status(201);
              res.body.ok.should.to.be.true;
              res.body.should.to.be.an('object');
              res.body.data.should.to.be.an('object');
              categories.push(res.body.data);
            });
        }
        setTimeout(done, 1900);
      });
    });

    describe('GET /categories', () => {  
      it('Should get all categories', done => {
        agent.get('/api/v1/categories')
          .set('x-access-token', token)
          .end((err, res) => {
            should.not.exist(err);
            res.should.to.have.status(200);
            res.body.should.to.be.an('object');
            res.body.ok.should.to.be.true;
            res.body.data.should.to.be.an('array');
            res.body.total_count.should.to.be.a('number');
            done();
          });
      });
    });
    
    describe('GET /categories/:id', () => {
      it('Should get category by id', done => {
        agent.get('/api/v1/categories/' + categories[0].id)
          .set('x-access-token', token)
          .end((err, res) => {
            should.not.exist(err);
            res.should.to.have.status(200);
            res.body.should.to.be.an('object');
            res.body.ok.should.to.be.true;
            res.body.data.should.to.be.an('object');
            done();
          });
      });
    });

    describe('PUT /categories/:id', () => {
      it('Should update category by id', done => {
        agent.put('/api/v1/categories/' + categories[0].id)
          .set('x-access-token', token)
          .send({ name: faker.hacker.noun() })
          .end((err, res) => {
            should.not.exist(err);
            res.should.to.have.status(202);
            res.body.should.to.be.an('object');
            res.body.ok.should.to.be.true;
            res.body.data.should.to.be.an('object');
            done();
          });
      });
    });

    describe('DELETE /categories/:id', () => {
      it('Should delete category by id', done => {
        agent.delete('/api/v1/categories/' + categories[0].id)
          .set('x-access-token', token)
          .end((err, res) => {
            should.not.exist(err);
            res.should.to.have.status(200);
            res.body.should.to.be.an('object');
            res.body.ok.should.to.be.true;
            done();
          });
      });
    });
  });
});