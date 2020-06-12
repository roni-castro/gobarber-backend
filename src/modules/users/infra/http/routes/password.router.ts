import { Router } from 'express';
import ForgotPasswordController from '../controllers/forgot-password.controller';
import ResetPasswordController from '../controllers/reset-password.controller';

const passwordRouter = Router();
const forgotPasswordController = new ForgotPasswordController();
const resetPasswordController = new ResetPasswordController();

passwordRouter.post('/forgot', forgotPasswordController.create);
passwordRouter.post('/reset', resetPasswordController.create);

export default passwordRouter;
