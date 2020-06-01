import { ConnectionOptions } from 'typeorm';

const config: ConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'gobarber',
  entities: [`src/**/entities/*.ts`],
  migrations: ['src/**/database/migration/*.ts'],
  cli: {
    entitiesDir: 'src/**/entities/*.ts',
    migrationsDir: 'src/**/database/migration/*.ts',
  },
};

export = config;
