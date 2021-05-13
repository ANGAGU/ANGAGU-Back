import { createServer } from 'http';
import App from '../app';

const port: number = Number(process.env.PORT) || 3000;

const { app } = new App();
const server = createServer(app);

server.listen(port, () => {
  console.log(`${port}포트 서버 실행`);
});

export default server;
