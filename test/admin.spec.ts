import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../bin/www';

chai.use(chaiHttp);

describe('admin test', () => {
  it('get approve product list test', async () => {
    const getResult = await chai.request(server).get('/admin/products');
    expect(getResult).to.have.status(200);
  });
  it('approve a product', async () => {
    const approveResult = await chai.request(server).put('/admin/products/1');
    expect(approveResult).to.have.status(200);
  });
});
