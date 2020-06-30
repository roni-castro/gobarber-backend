import ICacheProvider from '../models/i-cache-provider';

interface IFakeCache {
  [key: string]: string;
}

export default class FakeCacheProvider implements ICacheProvider {
  private cache: IFakeCache = {};

  public async save(key: string, value: any) {
    this.cache[key] = JSON.stringify(value);
  }

  public async recover<T>(key: string): Promise<T | null> {
    const data = this.cache[key];
    return data ? (JSON.parse(data) as T) : null;
  }

  public async invalidate(key: string) {
    delete this.cache[key];
  }

  public async invalidatePrefix(prefix: string) {
    const keys = Object.keys(this.cache).filter(key =>
      key.startsWith(`${prefix}:`)
    );
    keys.forEach(key => {
      delete this.cache[key];
    });
  }
}
