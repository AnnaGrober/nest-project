import { Module } from '@nestjs/common';
import { SendFileController } from './send-file.controller';
import { SendFileService } from './send-file.service';

@Module({
  imports: [],
  controllers: [SendFileController],
  providers: [SendFileService],
})
export class FilesModule {}
