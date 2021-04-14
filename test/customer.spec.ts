import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../bin/www';
import * as service from '../database/customer-service';

chai.use(chaiHttp);

describe('customer test', () => {
  it('login db test', async () => {
    const result = await service.getCustomerByEmailPassword('abcd', 'abcd');
    expect(result.status).to.equal('success');
  });

  it('login api test', async () => {
    const res = await chai.request(server).post('/customer/login').send({ email: 'abcd', password: 'abcd' });
    expect(res.status).to.equal(202);

    const res2 = await chai.request(server).post('/customer/login').send({ email: 'abcd@acd.com', password: 'abcdadf' });
    expect(res2.status).to.equal(202);
  });

  it('get product db test', async () => {
    const result = await service.getProducts();
    expect(result.status).to.equal('success');
  });

  it('get product api test', async () => {
    const res = await chai.request(server).get('/customer/products').send();
    expect(res.body.status).to.equal('success');
  });
});

describe('product information test', () => {
  it('it should get a product', async () => {
    const getProductResult = await chai.request(server).get('/customer/products/1');
    expect(getProductResult.body.status).to.equal('success');
  });
  it('it should not get a product', async () => {
    const notGetProductResult = await chai.request(server).get('/customer/products/512315');
    expect(notGetProductResult.body.status).to.equal('error');
  });
});
