import { Request, Response, NextFunction } from 'express';
import Recipe from '../model/recipeModel';
import { validateSignup } from '../validate/validator';

import jwt from 'jsonwebtoken';
import User, { IUser } from '../model/userModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN!,
  });
};

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const Valid = validateSignup.validate(req.body);
    let errorM: string = Valid.error?.details[0].message!;

    if (Valid.error) {
      return next(new AppError(errorM, 400));
    }

    const newUser: IUser = await User.create({
      fullname: req.body.fullname,
      email: req.body.email,
      password: req.body.password,
    });

    const token = signToken(newUser._id);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser,
      },
    });
  }
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    //if email and password exist
    if (!email || !password) {
      return next(new AppError('Please provide email and password!', 400));
    }

    // check if user exits && password is correcct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user!.correctPassword(password, user!.password))) {
      return next(new AppError(`Incorrect email or password`, 401));
    }

    // everytbing is ok, send token
    const token = signToken(user.id);

    res.status(200).json({
      status: 'success',
      token,
    });
  }
);

export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) Getting token and check if its there

    // validate token

    next();
  }
);
