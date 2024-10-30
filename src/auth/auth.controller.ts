import { Body, Controller, Post } from '@nestjs/common';
import { RegisterPayloadDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LoginPayloadDto } from './dto/login.dto';
import { ApiTags, ApiResponse, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { exampleValueAuth } from 'src/config/constants';


@ApiTags('auth')
@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post('/login')
    @ApiBody({ type: LoginPayloadDto,examples: { ex1: { value: exampleValueAuth } } })
    @ApiResponse({ status: 200, description: 'Success', })
    async login(@Body() loginPayloadDto: LoginPayloadDto) {
        return await this.authService.login(loginPayloadDto);
    }

    @Post('/register')
    @ApiBody({ type: RegisterPayloadDto, examples: { ex1: { value: exampleValueAuth } } })
    @ApiOkResponse({ description: 'Success' })
    async register(@Body() registerPayloadDto: RegisterPayloadDto) {
        return await this.authService.registerUser(registerPayloadDto);
    }
}
