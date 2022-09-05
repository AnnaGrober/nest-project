import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs';
@Controller()
export class AppController {
  constructor(
    private readonly httpService: HttpService,
  ) {}

  @Get()
  getHello(): string {
    return 'Hello World!';
  }

  @Get('get-datetime')
  findAll() {
    const result = this.httpService.get('http://localhost:3003/datetime');
    return result.pipe(map((response) => response.data));
  }

  @Get('datetime')
  datetime() {
    return new Date();
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
