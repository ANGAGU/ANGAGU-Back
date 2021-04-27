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

describe('company signup test', () => {
  it('company signup ducplicate', async () => {
    const info = {
      email: 'naver@gmail.com',
      name: 'test company',
      password: 'test',
      phone_number: '12312341234',
      business_number: '1256415',
      account_number: '8654565564',
      account_holder: '김회사',
      account_bank: '국민은행',
    };
    const res = await chai.request(server).post('/company/signup').send(info);
    expect(res.status).to.equal(404);
  });
});
