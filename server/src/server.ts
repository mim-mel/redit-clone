import express from 'express';
import morgan from 'morgan';

const app = express();

app.use(express.json());
app.use(morgan('dev'));

//app.get url로 접속하면 해당 블록의 코드를 실행
app.get('/', (_, res) => res.send('running'));

let port = 4000;

//app.listen의 포트로 접속하면 해당 블록의 코드를 실행
app.listen(port, async () => {
  console.log(`server running at http://localhost:${port}`);
});
