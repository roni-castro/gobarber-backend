import { createConnections } from 'typeorm';
import { postgresConfig, mongoConfig } from './ormconfig';

createConnections([mongoConfig, postgresConfig])
  .then(_connection => {
    console.log('Connected to database');
  })
  .catch(error => console.log('Error connection to database', error));
