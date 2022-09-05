import {Column, CreateDateColumn, Entity, InsertEvent, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {createParamDecorator, ExecutionContext} from "@nestjs/common";

@Entity()
export class File {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    name: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;



}
