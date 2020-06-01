import { ConnectionOptions } from 'typeorm';

const config: ConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'gobarber',
  entities: ['src/**/typeorm/entities/*.ts'],
  migrations: ['src/shared/infra/typeorm/migrations/*.ts'],
  cli: {
    entitiesDir: 'src/**/typeorm/entities/*.ts',
    migrationsDir: 'src/shared/infra/typeorm/migrations',
  },
};

export = config;
