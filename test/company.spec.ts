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

  it('login test', async () => {
    const res = await chai.request(server).post('/company/login').send({ email: 'abcd', password: 'abcd' });
    expect(res.status).to.equal(202);
  });
});
