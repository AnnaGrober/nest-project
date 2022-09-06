import {Body, Controller, Get, Injectable, Post, Req, Request, Res, UseGuards} from '@nestjs/common';
import {RegistrationReqModel} from 'src/models/registration.req.model';
import {UsersService} from './users.service';
import {User} from './user.entity';
import {Response} from 'express';
import {JwtService} from "@nestjs/jwt";
import {map, Observable, from} from "rxjs";
import {LoginModel} from "../models/login.model";
import {JwtAuthGuard} from "./jwt-auth.guard";

@Controller('users')
@Injectable()
export class UsersController {
    constructor(private userService: UsersService,
                private jwtService: JwtService) {
    }

    @Post('registration')
    async registerUser(@Body() reg: RegistrationReqModel) {
        return await this.userService.registerUser(reg);
    }

    @Post('login')
    async login(@Body() req: LoginModel, @Res({passthrough: true}) res: Response) {
        return await this.userService.login(req);
    }

    @Get('get-user-history')
    @UseGuards(JwtAuthGuard)
    async userHistory(@Request() request) {
        const user = request.user.id;
        return await this.userService.userHistory(user);
    }
}
