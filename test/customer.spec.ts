import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../bin/www';
import * as service from '../database/customer-service';

chai.use(chaiHttp);

describe('customer test', () => {
  it('login db test', async () => {
    const result = await service.getCustomerByEmail('abcd');
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

  it('get address db test', async () => {
    const result = await service.getAddress(0);
    expect(result.status).to.equal('success');
  });

  it('get address api test', async () => {
    const res = await chai.request(server).get('/customer/address').send();
    expect(res.status).to.equal(403);
  });

  it('post address db test', async () => {
    const result = await service.postAddress({
      id: 0,
      recipient: 'test recipient',
      land: 'test land',
      detail: 'test detail',
      is_default: 1,
    });
    expect(result.status).to.equal('success');
  });

  it('post address api test', async () => {
    const res = await chai.request(server).post('/customer/address').send();
    expect(res.status).to.equal(403);
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

describe('customer order test', () => {
  it('it should get a order list', async () => {
    const getOrderListDetail = await service.getOrderList(1);
    expect(getOrderListDetail.status).to.equal('success');
  });
  it('it should get a order detail', async () => {
    const getOrderListDetail = await service.getOrderDetail(1);
    expect(getOrderListDetail.status).to.equal('success');
  });
});

describe('customer ar detail test', () => {
  it('it should get a 3d model s3 url', async () => {
    const modelUrl = await chai.request(server).get('/customer/products/1/ar');
    expect(modelUrl.status).to.equal(200);
  });
});

describe('customer signup test', () => {
  it('customer signup test', async () => {
    const info = {
      email: 'test@naver.com',
      password: 'test',
      name: 'whalswo',
      birth: '1997-04-05',
      phone_number: '01055559999',
    };
    const res = await chai.request(server).post('/customer/signup').send(info);
    expect(res.status).to.equal(404);
  });
});
