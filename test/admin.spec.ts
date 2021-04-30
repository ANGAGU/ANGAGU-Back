import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../bin/www';
import * as service from '../database/admin-service';

chai.use(chaiHttp);

describe('admin test', () => {
  it('get approve product list test', async () => {
    const getResult = await service.getApproveProductList();
    expect(getResult.status).to.equal('success');
  });
  it('approve a product', async () => {
    const approveResult = await service.approveProduct(1);
    expect(approveResult.status).to.equal('success');
  });

  it('login db test', async () => {
    const result = await service.getAdminByIdPassword('abcd', 'abcd');
    expect(result.status).to.equal('success');
  });

  it('login api test', async () => {
    const res = await chai.request(server).post('/admin/login').send({ id: 'abcd', password: 'abcd' });
    expect(res.status).to.equal(202);
  });
});

describe('admin test', () => {
  it('get sale test', async () => {
    const getSaleResult = await service.getSale();
    expect(getSaleResult.status).to.equal('success');
  });
});
