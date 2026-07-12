import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Service } from '../services/service.entity';

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id:number;

  @Column()
  customerName:string;

  @Column()
  customerEmail:string;

  @Column()
  customerPhone:string;

  @Column()
  bookingDate:string; // YYYY-MM-DD

  @Column()
  bookingTime:string; // HH:MM

  @Column({ type:'text', default:BookingStatus.PENDING })
  status:BookingStatus;

  @Column({ nullable: true })
  notes:string;

  @ManyToOne(() => Service, { eager:true, onDelete:'CASCADE' })
  service:Service;
}