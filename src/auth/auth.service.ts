import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private jwtService:JwtService) {}

  // Mocked registration endpoint logic
  async register(body:any) {
    const hashedPassword = await bcrypt.hash(body.password, 10);
    return { message:'User registered successfully', username:body.username };
  }

  async login(body:any) {
    // Demonstration credentials: username = admin, password = password123
    if (body.username === 'admin' && body.password === 'password123') {
      const payload = { username:body.username, sub:1 };
      return { access_token:this.jwtService.sign(payload) };
    }
    throw new UnauthorizedException('Invalid credentials');
  }
}