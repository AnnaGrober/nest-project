import { Module } from "@nestjs/common";
import FileController from "./file.controller";
import FileService from "./file.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { File } from "./file.entity";
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [TypeOrmModule.forFeature([File]), RedisModule.forRoot({
    config: {
      url: process.env.REDIS_FULL_CONNECT_URL,
    }
  })],
  controllers: [FileController],
  providers: [FileService]
})
export class FilesModule {
}
