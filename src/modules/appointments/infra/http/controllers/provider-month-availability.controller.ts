import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProviderMonthAvailabilityUseCase from '@modules/appointments/services/list-provider-month-availability.usecase';

export default class ProviderMonthAvailabilityController {
  public async index(request: Request, response: Response) {
    const listProviderMonthAvailabilityUseCase = container.resolve(
      ListProviderMonthAvailabilityUseCase
    );
    const { provider_id } = request.params;
    const { month, year } = request.query;
    const { timezone } = request.headers;
    const providerAvailabilityDays = await listProviderMonthAvailabilityUseCase.execute(
      {
        userId: provider_id,
        month: +month,
        year: +year,
        timezone: timezone as string,
      }
    );
    return response.json(providerAvailabilityDays);
  }
}
