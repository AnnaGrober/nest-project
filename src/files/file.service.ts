import { UploadedFile } from '@nestjs/common';

export default class SendFileService {
  sendFile(@UploadedFile() file: Express.Multer.File) {
    if (this.convert(file)) {
      return file.filename;
    }
  }

  convert(@UploadedFile() file: Express.Multer.File) {
    return true;
  }
}
