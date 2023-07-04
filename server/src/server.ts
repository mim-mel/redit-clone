import express from 'express';
import morgan from 'morgan';
import { AppDataSource } from './data-source';
import authRoutes from './routes/auth';
import cors from 'cors';

const app = express();

//cors 설정
const origin = 'http://localhost:3000';
app.use(
  cors({
    origin,
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan('dev'));

//routes import
app.use('/api/auth', authRoutes);

//app.get url로 접속하면 해당 블록의 코드를 실행
app.get('/', (_, res) => res.send('running'));

let port = 4000;

//app.listen의 포트로 접속하면 해당 블록의 코드를 실행
app.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);

  //서버가 실행이 되면 데이터베이스를 connection해줌
  AppDataSource.initialize()
    .then(async () => {
      console.log('database initialized');
    })
    .catch(error => console.log(error));
});
