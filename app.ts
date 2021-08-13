import 'dotenv/config';
import * as express from 'express';
import loginCtrl from './apis/userCtrl';

const app = express();

app.use(express.json());

app.use('/api/user', loginCtrl);

export default app;