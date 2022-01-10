import mongoose from 'mongoose';
import dotenv from 'dotenv';

process.on('uncaughtException', (err) => {
  console.log('UNHANDLED REJECTION! 💥 🥵, shutting down ...');
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});

dotenv.config();
import app from './app';

const DB = process.env.MONGO_URL?.replace(
  '<password>',
  process.env.MONGO_PASSWORD!
) as string;

mongoose
  .connect(DB)
  .then(() => {
    console.log('DB connection successful....!!!');
  })
  .catch((err) => {
    console.log(err);
  });

const port = process.env.PORT || 3001;

const server = app.listen(port, () => {
  console.log(`server running on port ${port}...`);
});

process.on('unhandledRejection', (err: Error) => {
  console.log('UNHANDLED REJECTION! 💥 🥵, shutting down ...');
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});
