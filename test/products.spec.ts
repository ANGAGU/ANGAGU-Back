import chai from 'chai';
import chaiHttp from 'chai-http'
import { doesNotMatch } from 'node:assert';
import server from '../bin/www';
import * as productService from  '../database/products-service'

const expect = chai.expect;
const should = chai.should;
chai.use(chaiHttp);


describe('/GET/:id product', () => {
  it('it should get a product', (done) => {
    chai.request(server)
      .get('/products/1')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('object');
        done();
      });
  });
  it('it should not get a product', (done) => {
    chai.request(server)
      .get('/products/512315')
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });
});