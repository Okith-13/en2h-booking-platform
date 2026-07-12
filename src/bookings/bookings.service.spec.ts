import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { Booking } from './booking.entity';
import { ServicesService } from '../services/services.service';

// Tell TypeScript that the Jest globals exist in this context
declare const describe:any;
declare const beforeEach:any;
declare const it:any;
declare const expect:any;
declare const jest:any;

describe('BookingsService Unit Tests', () => {
  let service:BookingsService;
  let mockBookingRepository:any;
  let mockServicesService:any;

  beforeEach(async () => {
    mockBookingRepository = {
      findOne: jest.fn(),
      create: jest.fn().mockImplementation((dto: any) => dto),
      save: jest.fn().mockImplementation((booking: any) => Promise.resolve({ id: 1, ...booking })),
    };

    mockServicesService = {
      findOne: jest.fn().mockResolvedValue({ id: 1, title: 'Test Service' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        { provide: getRepositoryToken(Booking), useValue:mockBookingRepository },
        { provide: ServicesService, useValue: mockServicesService },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
  });

  it('should successfully create a valid booking', async () => {
    const dto = {
      customerName:'Alice',
      customerEmail:'alice@example.com',
      customerPhone:'12345678',
      serviceId:1,
      bookingDate:'2026-12-01',
      bookingTime:'10:00',
    };

    const result = await service.create(dto);
    expect(result).toBeDefined();
    expect(result.customerName).toEqual('Alice');
  });

  it('should throw an error if booking date is in the past', async () => {
    const dto = {
      customerName:'Alice',
      customerEmail:'alice@example.com',
      customerPhone:'12345678',
      serviceId:1,
      bookingDate:'2020-01-01',
      bookingTime:'10:00',
    };

    try {
      await service.create(dto);
    } catch (error:any) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });
});