import express, { Application } from 'express';
import recipeRouter from './routes/recipeRoutes';

const app = express();
app.use(express.json());

app.use('/api/v1/recipes', recipeRouter);

export default app;
