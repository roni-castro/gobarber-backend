import { createConnections } from 'typeorm';
import ormConnections from './ormconfig';

createConnections(ormConnections)
  .then(_connection => {
    console.log('Connected to database');
  })
  .catch(error => console.log('Error connection to database', error));
