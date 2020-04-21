import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Appointments {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  provider: string;

  @Column('timestamp with time zone')
  date: Date;
}

export default Appointments;
