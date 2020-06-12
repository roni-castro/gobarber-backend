import IHashProvider from '../models/IHashProvider';

export default class FakeHashProvider implements IHashProvider {
  generateHash(payload: string): Promise<string> {
    return Promise.resolve(payload);
  }
  compareHash(payload: string, hashed: string): Promise<boolean> {
    return Promise.resolve(payload === hashed);
  }
}
