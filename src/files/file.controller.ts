import {Controller, Get, Post, Query, Request, StreamableFile, UploadedFile, UseGuards, UseInterceptors} from '@nestjs/common';
import FileService from './file.service';
import {FileInterceptor} from '@nestjs/platform-express';
import {JwtAuthGuard} from "../users/jwt-auth.guard";
import {File} from "./file.entity";


@Controller('file')
export default class FileController {
    constructor(private readonly sendFileService: FileService) {
    }

    @Post('upload')
    @UseGuards(JwtAuthGuard)
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
    uploadFile(@Request() request, @UploadedFile() file: Express.Multer.File) {
        const user = request.user;
        return this.sendFileService.sendFile(file, user.id);
    }

    @Get('my-files')
    @UseGuards(JwtAuthGuard)
    getFiles(@Request() request){
        const user = request.user;
        return this.sendFileService.getFiles(user.id);
    }

    @Get('')
    getFile(@Query() query: { name: string }): StreamableFile {
        return this.sendFileService.getFile(query.name);
    }

    @Get('all')
    getAllFiles(): any[] {
        return this.sendFileService.getAllFiles();
    }

}
