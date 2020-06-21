import { Router } from 'express';
import ProvidersController from '../controllers/provider.controller';
import ProviderMonthAvailabilityController from '../controllers/provider-month-availability.controller';
import ProviderDayAvailabilityController from '../controllers/provider-day-availability.controller';

const providerRouter = Router();
const providerController = new ProvidersController();
const providerMonthAvailabilityController = new ProviderMonthAvailabilityController();
const providerDayAvailabilityController = new ProviderDayAvailabilityController();

providerRouter.get('/', providerController.index);
providerRouter.get(
  '/:provider_id/day-availability',
  providerDayAvailabilityController.index
);
providerRouter.get(
  '/:provider_id/month-availability',
  providerMonthAvailabilityController.index
);

export default providerRouter;
