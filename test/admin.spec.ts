import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../bin/www';
import * as service from '../database/admin-service';

chai.use(chaiHttp);

describe('admin test', () => {
  it('get approve product list test', async () => {
    const getResult = await chai.request(server).get('/admin/products');
    expect(getResult).to.have.status(403);
  });
  it('approve a product', async () => {
    const approveResult = await chai.request(server).put('/admin/products/1');
    expect(approveResult).to.have.status(403);
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
