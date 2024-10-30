import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterPayloadDto } from './dto/register.dto';
import { LoginPayloadDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';


@Injectable()
export class AuthService {

    constructor(private readonly jwtService: JwtService,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>
    ) { }

    async login(loginPayloadDto:LoginPayloadDto) {
        const { username, password } = loginPayloadDto;
    
        const user = await this.userRepo.findOne({ where: { username } });
        
        if (user && await bcrypt.compare(password, user.password)) {
          const { password, ...userData } = user; 
          const token = this.jwtService.sign({ id: user.id, username: user.username });
    
          return {
            access_token: token,
            user: userData
          };
        }
        throw new HttpException('Invalid credentials',401)
      }

    async registerUser(registerPayloadDto: RegisterPayloadDto) {
        const passwordHash = await bcrypt.hash(registerPayloadDto.password,10);
        return await this.userRepo.save({ ...registerPayloadDto,password: passwordHash });
    }
}
