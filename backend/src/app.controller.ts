import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { User } from './user.model'; // <-- Import Request here

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


  @UseGuards(AuthGuard('jwt'))
  @Get()
  getHello(@Req() req: Request): string {
    // The user object is attached to the request by the AuthGuard
    const user = req.user as User;

    // Example: Use the user's email from the payload
    // Note: The structure of the user object depends on your JwtStrategy's validate method
    return `Hello, world! You are logged in as: ${user.username}!`;
  }

  @Get(':id')
  getId(@Param('id') id: string) {
    return `Id: ${id}!!`;
  }
}
