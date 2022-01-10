import express, { Application } from 'express';
import morgan from 'morgan';
import recipeRouter from './routes/recipeRoutes';

const app: Application = express();
app.use(express.json());

if (process.env.ENVIRONMENT === 'developement') {
  app.use(morgan('dev'));
}

app.use('/api/v1/recipes', recipeRouter);

export default app;
