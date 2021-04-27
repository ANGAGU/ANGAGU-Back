import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../bin/www';
import * as service from '../database/company-service';

chai.use(chaiHttp);

describe('admin test', () => {
  it('get approve list test', async () => {
    const getResult = await chai.request(server).get('/admin/approve');
    expect(getResult).to.have.status(200);
  });
});
