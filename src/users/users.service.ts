import {Injectable, Request, UnauthorizedException} from '@nestjs/common';
import {Repository} from 'typeorm';
import {User} from './user.entity';
import {RegistrationReqModel} from '../models/registration.req.model';
import {RegistrationRespModel} from '../models/registration.resp.model';
import {JwtService} from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {InjectRepository} from '@nestjs/typeorm';
import {LoginModel} from "../models/login.model";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private jwtService: JwtService,
    ) {
    }

    findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async remove(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }

    private async registrationValidation(
        regModel: RegistrationReqModel,
    ): Promise<string> {
        if (!regModel.email) {
            return "Email can't be empty";
        }

        const emailRule =
            /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if (!emailRule.test(regModel.email.toLowerCase())) {
            return 'Invalid email';
        }

        const user = await this.userRepository.findOne({
            where: {email: regModel.email},
        });
        if (user != null && user.email) {
            return 'Email already exist';
        }

        if (regModel.password !== regModel.confirmPassword) {
            return 'Confirm password not matching';
        }
        return '';
    }

    private async getPasswordHash(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    public async registerUser(
        regModel: RegistrationReqModel,
    ): Promise<RegistrationRespModel> {
        const result = new RegistrationRespModel();

        const errorMessage = await this.registrationValidation(regModel);
        if (errorMessage) {
            result.message = errorMessage;
            result.successStatus = false;

            return result;
        }

        const newUser = new User();
        newUser.firstName = regModel.firstName;
        newUser.lastName = regModel.lastName;
        newUser.email = regModel.email;
        newUser.password = await this.getPasswordHash(regModel.password);

        await this.userRepository.insert(newUser);
        result.successStatus = true;
        result.message = 'success';
        return result;
    }

    public async validateUserCredentials(
        email: string,
        password: string,
    ): Promise<User> {
        const user = await this.userRepository.findOne({
            where: {email: email},
        });

        if (user == null) {
            return null;
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return null;
        }

        const currentUser = new User();
        currentUser.id = user.id;
        currentUser.firstName = user.firstName;
        currentUser.lastName = user.lastName;
        currentUser.email = user.email;

        return currentUser;
    }

    public async getJwtToken(user: User): Promise<string> {
        const payload = {
            ...user,
        };
        return this.jwtService.signAsync(payload);
    }

    public async login(logModel: LoginModel) {
        const validateUser = await this.validateUser(logModel.email, logModel.password);

        if (!validateUser) {
            throw new UnauthorizedException();
        }
        const payload = {username: validateUser.lastName, sub: validateUser.id};
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.findByEmail(email);
        if (user && await bcrypt.compare(pass, user.password)) {
            const {password, ...result} = user;
            return result;
        }
        return null;
    }

    async findByEmail(email: string): Promise<User | undefined> {
        return this.userRepository.findOne({
            where: {
                email: email
            }
        });
    }

}
