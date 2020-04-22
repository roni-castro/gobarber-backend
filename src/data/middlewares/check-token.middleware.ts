import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import signingConstants from '../../domain/session/signing.constants';

export default (request: Request, response: Response, next: NextFunction) => {
  const authorizationHeader = request.headers.authorization;
  if (!authorizationHeader) {
    return response.json({ message: 'Authorization token not provided' });
  }
  const authorizationToken = authorizationHeader.split(' ')[1];
  if (!authorizationToken) {
    return response.json({ message: 'Token is not in a valid format' });
  }
  try {
    const decodedToken = jwt.verify(
      authorizationToken,
      signingConstants.secretKey
    );
    return next();
  } catch {
    return response.json({ message: 'Token is invalid' });
  }
};
