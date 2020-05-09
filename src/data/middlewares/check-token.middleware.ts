import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import signingConstants from '../../config/signing.constants';
import AppError from '../error/AppError';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default (
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  const authorizationHeader = request.headers.authorization;
  if (!authorizationHeader) {
    throw new AppError('Authorization token not provided', 401);
  }
  const [, authorizationToken] = authorizationHeader.split(' ');
  if (!authorizationToken) {
    throw new AppError('Token is not in a valid format', 401);
  }
  try {
    const decoded = jwt.verify(authorizationToken, signingConstants.secretKey);
    const { sub } = decoded as TokenPayload;
    request.user = { id: sub };
    return next();
  } catch {
    throw new AppError('Token is invalid', 401);
  }
};
