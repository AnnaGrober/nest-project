import {User} from './user.entity';
import {UsersService} from './users.service';
import {Module} from '@nestjs/common';
import {PassportModule} from '@nestjs/passport';
import {jwtConstants} from './constants';
import {UsersController} from './users.controller';
import {JwtModule} from '@nestjs/jwt';
import {LocalStrategy} from './local.strategy';
import {TypeOrmModule} from '@nestjs/typeorm';
import {APP_GUARD} from "@nestjs/core";
import { Strategy } from "passport-jwt";
import {JwtStrategy} from "./jwt.strategy";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: {expiresIn: '60s'},
        }),
    ],
    providers: [UsersService, JwtStrategy],
    controllers: [UsersController],
})
export class UsersModule {
}
