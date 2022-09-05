import {StreamableFile, UploadedFile} from '@nestjs/common';
import {createReadStream, readdirSync} from 'fs';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {File} from './file.entity';


export default class FileService {
    public files = [];

    constructor(
        @InjectRepository(File)
        private fileRepository: Repository<File>
    ) {
    }


    public sendFile(@UploadedFile() file: Express.Multer.File, userId) {
        if (this.convert(file) && file !== undefined) {
            const fileToSave = new File();
            fileToSave.userId = userId;
            fileToSave.name = file.originalname;

            this.saveFile(fileToSave);
            return file.originalname;
        }
    }

    public getFiles(userId) {
        return this.fileRepository.find({
            where: {
                userId: userId
            }
        });
    }

    public saveFile(file: File) {
        this.fileRepository.save(file);
    }

    public getFile(name: string): StreamableFile {
        const filePath = `uploads/${name}`;
        const file = createReadStream(filePath);
        return new StreamableFile(file);
    }

    public getAllFiles() {
        this.throughDirectory('uploads');
        return this.files;
    }

    private throughDirectory(directory: string) {
        readdirSync(directory).forEach((file) => {
            return this.files.push(file);
        });
    }

    private convert(@UploadedFile() file: Express.Multer.File) {
        return true;
    }
}
