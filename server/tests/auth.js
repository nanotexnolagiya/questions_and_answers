

const chai = require("chai");
const chaiHttp = require("chai-http");
const faker = require('faker');
const should = chai.should();
const app = require('../app');
chai.use(chaiHttp);
const agent = chai.request.agent(app);

describe('AUTH SIGNIN', () => {
  it('Sign up user', done => {
    agent.post('/api/v1/auth/signup')
    .send({ 
      username: faker.internet.userName(), 
      phone: '+' + faker.phone.phoneNumber('998#########'), 
      password: faker.internet.password(), 
      email: faker.internet.email() 
    })
    .end((err, res) => {
      should.not.exist(err);
      res.should.to.have.status(201);
      res.body.should.to.be.an('object');
      res.body.token.should.to.be.a('string');
      res.body.ok.should.to.be.true;
      done();
    });
  });
});