import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListDayAvailabilityProvidersUseCase from '@modules/appointments/services/list-provider-day-availability.usecase';

export default class ProviderDayAvailabilityController {
  public async index(request: Request, response: Response) {
    const listDayAvailabilityProvidersUseCase = container.resolve(
      ListDayAvailabilityProvidersUseCase
    );
    const { provider_id } = request.params;
    const { day, month, year } = request.query;
    const { timezone } = request.headers;
    const providerAvailabilityHours = await listDayAvailabilityProvidersUseCase.execute(
      {
        userId: provider_id,
        day: +day,
        month: +month,
        year: +year,
        timezone: timezone as string,
      }
    );
    return response.json(providerAvailabilityHours);
  }
}
