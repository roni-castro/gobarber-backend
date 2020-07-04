import { NextFunction, Request, Response } from 'express';
import Redis from 'ioredis';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import AppError from '@shared/error/AppError';

const redisClient = new Redis({
  port: Number(process.env.REDIS_PORT),
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD || undefined,
  enableOfflineQueue: false,
});

const rateLimiterRedis = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rate-limit-default',
  points: 10, // Number of points
  duration: 1, // Per second
});

export default async function rateLimiterMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await rateLimiterRedis.consume(req.ip);
    return next();
  } catch (e) {
    throw new AppError('Too Many Requests', 429);
  }
}
