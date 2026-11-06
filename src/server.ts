import express from 'express';
import dotenv from 'dotenv';
import routes from './routes';
import { errorHandler } from './controllers/helpers';

dotenv.config();
const app = express();
app.use(express.json());
app.use('/api', routes);
app.use(errorHandler);

const port = Number(process.env.PORT || 5000);
app.listen(port, () => console.log(`Music API listening on http://localhost:${port}/api`));
