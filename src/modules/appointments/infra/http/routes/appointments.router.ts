import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import AppointmentController from '../controllers/appointment.controller';
import ProviderAppointmentsController from '../controllers/provider-appointments.controller';

const appointmentsRouter = Router();
const appointmentController = new AppointmentController();
const providerAppointmentsController = new ProviderAppointmentsController();

appointmentsRouter.get('/', appointmentController.show);
appointmentsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      provider_id: Joi.string().uuid().required(),
      date: Joi.string().required(),
    }),
  }),
  appointmentController.create
);
appointmentsRouter.get('/me', providerAppointmentsController.index);

export default appointmentsRouter;
