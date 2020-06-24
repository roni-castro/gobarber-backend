import { ConnectionOptions } from 'typeorm';

export const postgresConfig: ConnectionOptions = {
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

export const mongoConfig: ConnectionOptions = {
  name: 'mongo',
  type: 'mongodb',
  host: 'localhost',
  port: 27017,
  logging: false,
  database: 'gobarber',
  useUnifiedTopology: true,
  entities: ['src/**/typeorm/schemas/*.ts'],
};
