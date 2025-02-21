import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto, loginUserDto } from "src/users/users.dto";


@Controller('auth')
export class AuthController {
    constructor( private readonly authService: AuthService) {}

    @Post('signup')
    async signup(@Body() user: CreateUserDto) {
        const { confirmPassword, ...newUser } = user;
        return this.authService.signup(newUser, confirmPassword);
    }


    @Post('signin')
    async signin(@Body() loginUser: loginUserDto) {
        const { email, password } = loginUser;
        const token = await this.authService.signin(email, password);
    }
}