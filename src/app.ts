import express, { Application } from 'express';
import morgan from 'morgan';
import recipeRouter from './routes/recipeRoutes';

const app: Application = express();
app.use(express.json());

if (process.env.ENVIRONMENT === 'developement') {
  app.use(morgan('dev'));
}

app.use('/api/v1/recipes', recipeRouter);
// app.use('/api/v1/users', userRouter)

app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

export default app;
