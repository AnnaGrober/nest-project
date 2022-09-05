import {Body, Controller, Injectable, Post, Req, Request, Res} from '@nestjs/common';
import {RegistrationReqModel} from 'src/models/registration.req.model';
import {UsersService} from './users.service';
import {User} from './user.entity';
import {Response} from 'express';
import {JwtService} from "@nestjs/jwt";
import {map, Observable, from} from "rxjs";
import {LoginModel} from "../models/login.model";

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
}
