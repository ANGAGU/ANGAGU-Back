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

  it('login test', async () => {
    const res = await chai.request(server).post('/customer/login').send({ email: 'abcd', password: 'abcd' });
    expect(res.status).to.equal(202);
  });
});
