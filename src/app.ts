import express, { Application, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import AppError from './utils/appError';
import { globalErrorHandler } from './controllers/errorController';
import recipeRouter from './routes/recipeRoutes';

const app: Application = express();
app.use(express.json());

if (process.env.ENVIRONMENT === 'developement') {
  app.use(morgan('dev'));
}

app.use('/api/v1/recipes', recipeRouter);
// app.use('/api/v1/users', userRouter)

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
