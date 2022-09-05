import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadGatewayException,
} from '@nestjs/common';

import SendFileService from './send-file.service';
import { FileInterceptor } from '@nestjs/platform-express';
@Controller('send-file')
export default class SendFileController {
  constructor(private readonly sendFileService: SendFileService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './uploads',
      fileFilter: (
        req: any,
        file: { mimetype: string },
        cb: (error: Error | null, acceptFile: boolean) => void,
      ) => {
        if (['image/png'].includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Only use  png files'), false);
        }
      },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.sendFileService.sendFile(file);
  }
}
