import { ConnectionOptions } from 'typeorm';

const config: ConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
  entities: [`src/data/entity/**/*.ts`],
  migrations: ['src/data/migration/**/*.ts'],
  cli: {
    entitiesDir: 'src/data/entity',
    migrationsDir: 'src/data/migrations',
  },
};

export = config;
