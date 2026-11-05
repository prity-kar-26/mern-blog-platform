import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { logger } from './config/logger';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import v1Routes from './routes/v1';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

if (env.NODE_ENV !== 'test') {
  app.use(morgan('combined', { stream: { write: (msg) => logger.http(msg.trim()) } }));
}

app.use('/api/v1', v1Routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;