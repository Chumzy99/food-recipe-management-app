import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import dotenv from 'dotenv';

dotenv.config();

export const mongoDBConnect = () => {
  const DB = process.env.MONGO_URL?.replace(
    '<password>',
    process.env.MONGO_PASSWORD!
  ) as string;

  mongoose.connect(DB).then(() => {
    console.log('DB connection successful....!!!');
  });
  // .catch((err) => {
  //   console.log(err);
  // });
};

export const mongoMockConnect = () => {
  MongoMemoryServer.create().then((mongo) => {
    const uri = mongo.getUri();

    mongoose.connect(uri).then(() => {
      console.log(`Mock DB connected....`);
    });
  });
};
