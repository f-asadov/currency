import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './strategy';
import { User } from 'src/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { config } from 'dotenv';

config()

@Module({
  imports:[TypeOrmModule.forFeature([User]),PassportModule,JwtModule.register({
    secret:process.env.SECRET,
    signOptions:{expiresIn:'1h'}
  })],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy]
})
export class AuthModule {}
