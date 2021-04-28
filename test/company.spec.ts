import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../bin/www';
import * as service from '../database/company-service';

chai.use(chaiHttp);

describe('company test', () => {
  it('login db test', async () => {
    const result = await service.getCompanyByEmailPassword('abcd', 'abcd');
    expect(result.status).to.equal('success');
  });

  it('login api test', async () => {
    const res = await chai.request(server).post('/company/login').send({ email: 'abcd', password: 'abcd' });
    expect(res.status).to.equal(202);

    const res2 = await chai.request(server).post('/company/login').send({ email: 'abcd@acd.com', password: 'abcdadf' });
    expect(res2.status).to.equal(202);
  });

  it('get product db test', async () => {
    const result = await service.getProducts(0);
    expect(result.status).to.equal('success');
  });

  it('get product api test', async () => {
    const res = await chai.request(server).get('/company/products').send();
    expect(res.status).to.equal(403);
  });

  it('get sale db test', async () => {
    const result = await service.getSale(0);
    expect(result.status).to.equal('success');
  });

  it('get sale api test', async () => {
    const res = await chai.request(server).get('/company/sale').send();
    expect(res.status).to.equal(403);
  });
});

describe('company products test', () => {
  it('delete product detail test', async () => {
    const delDetailResult = await service.deleteProduct(100);
    expect(delDetailResult.status).to.equal('success');
  });
  it('delete product image test', async () => {
    const delImResult = await service.deleteProductImage(100);
    expect(delImResult.status).to.equal('success');
  });
});
