export default {
  expiresIn: process.env.APP_SECRET_EXPIRES_IN || '1d',
  secretKey: process.env.APP_SECRET || 'default',
};
