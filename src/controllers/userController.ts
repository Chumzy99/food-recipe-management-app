import User from '../model/userModel';
import { Request, Response, NextFunction } from 'express';
import catchAsync from '../utils/catchAsync';

export const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find();

    res.status(200).json({
      status: 'success.',
      results: users.length,
      data: { users },
    });
  }
);
