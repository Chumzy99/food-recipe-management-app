import express, { Application, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import xss from 'xss-clean';
import hpp from 'hpp';
import mongoSanitize from 'express-mongo-sanitize';
import dotenv from 'dotenv';
dotenv.config();

import AppError from './utils/appError';
import { globalErrorHandler } from './controllers/errorController';
import recipeRouter from './routes/recipeRoutes';
import userRouter from './routes/userRoutes';
import { mongoDBConnect, mongoMockConnect } from './database/db';
import { protect } from './controllers/authController';

const app: Application = express();

// Body parser
app.use(express.json());

// Set security HTTP headers
app.use(helmet());

// Dev logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// limit request from same api
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again in an hour',
});
app.use('/api', limiter);

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

/// Data sanitzation against xss
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: ['meal_type', 'difficulty_level'],
  })
);

if (process.env.NODE_ENV === 'test') {
  mongoMockConnect();
} else {
  mongoDBConnect();
}
app.use('/', protect);

app.use('/api/v1/recipes', recipeRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
