import { createConnection } from 'typeorm';
import ormconfig from './ormconfig';

createConnection(ormconfig)
  .then(_connection => {
    console.log('Connected to database');
  })
  .catch(error => console.log('Error connection to database', error));
