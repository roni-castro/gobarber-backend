import { ConnectionOptions } from 'typeorm';

const config: ConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'gobarber',
  entities: [`src/data/database/entity/**/*.ts`],
  migrations: ['src/data/database/migration/**/*.ts'],
  cli: {
    entitiesDir: 'src/data/database/entity',
    migrationsDir: 'src/data/database/migration',
  },
};

export = config;
