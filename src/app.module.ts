import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {FilesModule} from './files/file.module';
import {HttpModule} from '@nestjs/axios';
import { UsersModule } from "./users/users.module";
import {TypeOrmModule} from '@nestjs/typeorm';
import {ORMConfig} from '../ormconfig';
import {APP_GUARD} from '@nestjs/core';
import {AuthGuard} from './auth.guard';
import {AppGateway} from './app.gateway';

@Module({
    imports: [
        TypeOrmModule.forRoot(ORMConfig),
        FilesModule,
        HttpModule,
        UsersModule,
    ],
    controllers: [AppController],
    providers: [AppGateway],
})
export class AppModule {
}
