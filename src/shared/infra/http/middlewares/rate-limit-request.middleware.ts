import { NextFunction, Request, Response } from 'express';
import Redis from 'ioredis';
import { RateLimiterRedis } from 'rate-limiter-flexible';

const redisClient = new Redis({ enableOfflineQueue: false });

const rateLimiterRedis = new RateLimiterRedis({
  storeClient: redisClient,
  points: 10, // Number of points
  duration: 1, // Per second
});

const rateLimiterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await rateLimiterRedis.consume(req.ip);
    next();
  } catch (e) {}
  res.status(429).send('Too Many Requests');
};

export default rateLimiterMiddleware;
