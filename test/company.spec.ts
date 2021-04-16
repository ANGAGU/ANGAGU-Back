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
});

describe('company products test', () => {
  it('add product test', async () => {
    const addResult = await service.addProduct(1, 'descriptionUrl', 'thumbUrl', 'description', 'desk', 50000, 10, 3000);
    expect(addResult.status).to.equal('success');
  });
  it('delete product test', async () => {
    const delResult = await service.deleteProduct(1);
    expect(delResult.status).to.equal('success');
  });

  it('update product test', async () => {
    const upResult = await service.updateProduct(1, 'new_description', 'new_name', 111111, 1234, 111);
    expect(upResult.status).to.equal('success');
  });
});
