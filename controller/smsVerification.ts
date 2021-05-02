import Cache from 'memory-cache';
import request from 'request';
import crypto from 'crypto';
import {
  serviceId, accessKey, secretKey, myPhone,
} from '../config.json';

const space = ' ';
const newLine = '\n';

export const postVerifyCode = async (phoneNumber:string):Promise<any> => {
  const url = `https://sens.apigw.ntruss.com/sms/v2/services/${serviceId}/messages`;
  const timestamp = Date.now().toString();
  const url2 = `/sms/v2/services/${serviceId}/messages`;
  Cache.del(phoneNumber);

  let code = '';
  for (let i = 0; i < 6; i += 1) {
    code += Math.floor(Math.random() * 10).toString();
  }

  Cache.put(phoneNumber, code, 300000);

  const method = 'POST';
  const message = [];
  const hmac = crypto.createHmac('sha256', secretKey);

  message.push(method);
  message.push(space);
  message.push(url2);
  message.push(newLine);
  message.push(timestamp);
  message.push(newLine);
  message.push(accessKey);
  const signature = hmac.update(message.join('')).digest('base64');

  return new Promise((resolve, reject) => {
    request({
      method,
      uri: url,
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'x-ncp-iam-access-key': accessKey,
        'x-ncp-apigw-timestamp': timestamp,
        'x-ncp-apigw-signature-v2': signature,
      },
      body: {
        type: 'sms',
        contentType: 'COMM',
        countryCode: '82',
        from: `${myPhone}`,
        content: `인증번호는 ${code}입니다. 정확히 입력해주세요.`,
        messages: [
          {
            to: `${phoneNumber}`,
          },
        ],
      },
    }, (err, res, html) => {
      resolve(html);
    });
  });
};
export const confirmVerifyCode = async (phoneNumber: string, code: string):Promise<any> => {
  const CacheData = Cache.get(phoneNumber);

  if (!CacheData) {
    return {
      status: 'error',
      errCode: 400,
    };
  }
  if (CacheData !== code) {
    Cache.del(phoneNumber);
    return {
      status: 'error',
      errCode: 401,
    };
  }
  Cache.del(phoneNumber);
  return {
    status: 'success',
  };
};
