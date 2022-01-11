import { Request, Response, NextFunction } from 'express';
import { validateSignup } from '../validate/validator';

import jwt from 'jsonwebtoken';
import User, { IUser } from '../model/userModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import { CustomUserReq } from '../model/custom';

const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN!,
  });
};

const createSendToken = (user: IUser, statusCode: number, res: Response) => {
  const token = signToken(user!._id);

  const date =
    (process.env.JWT_COOKIE_EXPIRES_IN as unknown as number) *
    24 *
    60 *
    60 *
    1000;

  const cookieOptions = {
    expires: new Date(Date.now() + date),
    secure: false,
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
  }

  res.cookie('jwt', token, cookieOptions);

  //set password to undefined to hide it.
  user.password = undefined as any;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
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

    createSendToken(newUser, 201, res);
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
    createSendToken(user, 200, res);
  }
);

export const protect = catchAsync(
  async (req: CustomUserReq, res: Response, next: NextFunction) => {
    let token;
    // 1) Getting token and check if its there
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(
        new AppError(
          'You are not logged in!, Please log in to get access.',
          401
        )
      );
    }

    // validate token
    const decoded: any = await jwt.verify(token, process.env.JWT_SECRET!);

    // check if user still exists
    const freshUser = await User.findById(decoded.id);

    if (!freshUser) {
      return next(
        new AppError(
          'The user belonging to this token does no longer exist.',
          401
        )
      );
    }

    // check if user changed password after token was issued

    if (freshUser!.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError(
          'User recently changed password! Please log in again.',
          401
        )
      );
    }

    req.user = freshUser;
    next();
  }
);
