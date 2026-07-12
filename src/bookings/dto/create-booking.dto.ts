import { IsString, IsEmail, IsNumber, IsOptional } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  customerName:string;

  @IsEmail()
  customerEmail:string;

  @IsString()
  customerPhone:string;

  @IsNumber()
  serviceId:number;

  @IsString()
  bookingDate:string; // YYYY-MM-DD

  @IsString()
  bookingTime:string; // HH:MM

  @IsString()
  @IsOptional()
  notes?: string;
}