import { createConnections } from 'typeorm';

createConnections()
  .then(_connection => {
    console.log('Connected to database');
  })
  .catch(error => console.log('Error connection to database', error));
