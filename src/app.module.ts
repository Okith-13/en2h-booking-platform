import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ServicesModule } from './services/services.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type:'better-sqlite3' as any,
      database:'database.sqlite',
      entities:[__dirname + '/**/*.entity{.ts,.js}'],
      synchronize:true, // Auto creates database tables based on entities
    }),
    AuthModule,
    ServicesModule,
    BookingsModule,
  ],
})
export class AppModule {}