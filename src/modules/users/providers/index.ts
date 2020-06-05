import { container } from 'tsyringe';

import IHashProvider from './hashProvider/models/IHashProvider';
import BCryptHashProvider from './hashProvider/implementations/bcrypt-hash.provider';

container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProvider);
