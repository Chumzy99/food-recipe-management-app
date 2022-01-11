import User from '../model/userModel';
import { Request, Response, NextFunction } from 'express';
import catchAsync from '../utils/catchAsync';
import { CustomUserReq } from '../model/custom';
import AppError from '../utils/appError';

const filterObj = (obj: any, ...allowedFields: [string, string]) => {
  let newObj: any = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

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

export const updateMe = catchAsync(
  async (req: CustomUserReq, res: Response, next: NextFunction) => {
    if (req.body.password) {
      return next(new AppError('This route is not for password update. ', 400));
    }

    const filteredBody = filterObj(req.body, 'fullname', 'email');
    const updatedUser = await User.findByIdAndUpdate(
      req.user?.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );
    console.log(updatedUser);

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  }
);

export const deleteMe = catchAsync(
  async (req: CustomUserReq, res: Response, next: NextFunction) => {
    await User.findByIdAndUpdate(req.user?.id, { active: false });

    res.status(200).json({
      status: 'success',
      data: null,
    });
  }
);
