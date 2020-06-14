import checkTokenMiddleware from '@modules/users/infra/http/middlewares/check-token.middleware';
import { Router } from 'express';
import UserProfileController from '../controllers/user-profile.controller';

const userProfileRouter = Router();
const userProfileController = new UserProfileController();
userProfileRouter.use(checkTokenMiddleware);

userProfileRouter.get('/', userProfileController.show);
userProfileRouter.put('/', userProfileController.update);

export default userProfileRouter;
