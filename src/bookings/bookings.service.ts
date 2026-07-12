import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from './booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ServicesService } from '../services/services.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository:Repository<Booking>,
    private servicesService:ServicesService,
  ) {}

  async create(createBookingDto:CreateBookingDto) {
    // Business Rule: Service must exist
    const service = await this.servicesService.findOne(createBookingDto.serviceId);

    // Business Rule: Date cannot be in the past
    const today = new Date().toISOString().split('T')[0];
    if (createBookingDto.bookingDate < today) {
      throw new BadRequestException('Booking date cannot be in the past');
    }

    const existingBooking = await this.bookingRepository.findOne({
      where: {
        bookingDate:createBookingDto.bookingDate,
        bookingTime:createBookingDto.bookingTime,
        service: {id:service.id},
      },
    });
    if (existingBooking) {
      throw new BadRequestException('This service slot is already booked for this time.');
    }

    const booking = this.bookingRepository.create({
      ...createBookingDto,
      service,
      status:BookingStatus.PENDING,
    });

    return this.bookingRepository.save(booking);
  }

  findAll() {
    return this.bookingRepository.find();
  }

  async findOne(id:number) {
    const booking = await this.bookingRepository.findOne({where:{id}});
    if (!booking) throw new NotFoundException(`Booking with ID ${id} not found`);
    return booking;
  }

  async updateStatus(id:number, status:BookingStatus) {
    const booking = await this.findOne(id);

    if (booking.status === BookingStatus.CANCELLED && status === BookingStatus.COMPLETED) {
      throw new BadRequestException('Cancelled bookings cannot be marked as completed');
    }

    booking.status = status;
    return this.bookingRepository.save(booking);
  }

  async cancel(id:number) {
    return this.updateStatus(id, BookingStatus.CANCELLED);
  }
}