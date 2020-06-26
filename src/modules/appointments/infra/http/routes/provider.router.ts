import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
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
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      provider_id: Joi.string().uuid().required(),
    }),
    [Segments.QUERY]: Joi.object().keys({
      day: Joi.number().integer().min(1).max(31).required(),
      month: Joi.number().integer().min(1).max(12).required(),
      year: Joi.number().integer().min(1900).max(9999).required(),
    }),
  }),
  providerDayAvailabilityController.index
);
providerRouter.get(
  '/:provider_id/month-availability',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      provider_id: Joi.string().uuid().required(),
    }),
    [Segments.QUERY]: Joi.object().keys({
      month: Joi.number().integer().min(1).max(12).required(),
      year: Joi.number().integer().min(1900).max(9999).required(),
    }),
  }),
  providerMonthAvailabilityController.index
);

export default providerRouter;
