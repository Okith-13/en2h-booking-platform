import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Service {
  @PrimaryGeneratedColumn()
  id:number;

  @Column()
  title:string;

  @Column()
  description:string;

  @Column()
  duration:number; // in minutes

  @Column('decimal')
  price:number;

  @Column({ default: true })
  isActive:boolean;
}