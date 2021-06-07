# ANGAGU-Back
안가구 메인 서버
## 개발환경

```
node            15.5.0
npm             7.3.0
ubuntu          18.04
```

## Usage

1. 프로젝트 설정

```jsx
git clone https://github.com/ANGAGU/ANGAGU_Back.git
cd ANGAGU_BACK

npm i
cp config.sample.json config.json
```

2. config.json 설정

```jsx
{
    "dbConfig":{
        "host":,
        "user":,
        "password":,
        "database":,
        "timezone": ,
        "waitForConnections":,
        "connectionLimit":
    },
    "awsConfig":{
        "keyId":"aws key id",
        "secretAccessKey":"aws secret access key",
        "region":"aws region"
    },
    "jwtSecret": "insert jwt secret key",
    "accessKey": "ncloud accessKey",
    "secretKey": "ncloud secretKey",
    "serviceId": "ncloud sms service id",
    "myPhone": "sms calling number"
}
```

3. local에서 실행

```jsx
npm run dev
```

4. test 실행

```jsx
npm test
```
