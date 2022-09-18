import { StreamableFile, UploadedFile } from "@nestjs/common";
import { createReadStream, readdirSync } from "fs";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { File } from "./file.entity";
import { InjectRedis, Redis } from "@nestjs-modules/ioredis";
import { io } from "socket.io-client";

export default class FileService {
  public files = [];
  private socket;
  public messages;

  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
    @InjectRedis() private readonly redis: Redis
  ) {
    this.socket = io("http://localhost:3000");
    this.socket.on("msgToClient", (message) => {
      this.receivedMessage(message);
    });
  }

  receivedMessage(message) {
    this.messages.push(message);
  }

  public async sendFile(@UploadedFile() file: Express.Multer.File, userId) {
    await this.redis.lpush(
      "history_" + userId.toString(),
      JSON.stringify({
        user_id: userId,
        act: "пользователь отправил файл",
        date: new Date(Date.now()).toLocaleString(),
      })
    );
    if (this.convert(file) && file !== undefined) {
      await this.redis.lpush(
        "history_" + userId.toString(),
        JSON.stringify({
          user_id: userId,
          act: "пользователь конвертировал файл",
          date: new Date(Date.now()).toLocaleString(),
        })
      );
      const fileToSave = new File();
      fileToSave.userId = userId;
      fileToSave.name = file.originalname;

      this.saveFile(fileToSave);
      this.socket.emit("Файл успешно сконвертировался!");
      return file.originalname;
    }
  }

  public async getFiles(userId) {
    await this.redis.lpush(
      "history_" + userId.toString(),
      JSON.stringify({
        user_id: userId,
        act: "пользователь получил файлы",
        date: new Date(Date.now()).toLocaleString(),
      })
    );
    return this.fileRepository.find({
      where: {
        userId: userId,
      },
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
    this.throughDirectory("uploads");
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
