import { Controller, Get, Post, Body, Param, Patch, Put } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService:BookingsService) {}

  // Public Endpoint: Customers can book without logging in
  @Post()
  create(@Body() createBookingDto:CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }

  @Get()
  findAll() {
    return this.bookingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id:string) {
    return this.bookingsService.findOne(+id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id:string, @Body() updateStatusDto: UpdateBookingStatusDto) {
    return this.bookingsService.updateStatus(+id, updateStatusDto.status);
  }

  @Put(':id/cancel')
  cancel(@Param('id') id:string) {
    return this.bookingsService.cancel(+id);
  }
}