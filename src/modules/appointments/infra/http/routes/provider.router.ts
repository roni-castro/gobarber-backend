import { Router } from 'express';
import ProvidersController from '../controllers/provider.controller';

const providerRouter = Router();
const providerController = new ProvidersController();

providerRouter.get('/', providerController.index);

export default providerRouter;
