import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import signingConstants from '../../config/signing.constants';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default (request: Request, response: Response, next: NextFunction) => {
  const authorizationHeader = request.headers.authorization;
  if (!authorizationHeader) {
    return response.json({ message: 'Authorization token not provided' });
  }
  const [, authorizationToken] = authorizationHeader.split(' ');
  if (!authorizationToken) {
    return response.json({ message: 'Token is not in a valid format' });
  }
  try {
    const decoded = jwt.verify(authorizationToken, signingConstants.secretKey);
    const { sub } = decoded as TokenPayload;
    request.user = { id: sub };
    return next();
  } catch {
    return response.json({ message: 'Token is invalid' });
  }
};
