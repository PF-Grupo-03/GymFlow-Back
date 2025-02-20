import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";


@Controller('auth')
export class AuthController {
    constructor( private readonly authService: AuthService) {}

    @Post('signup')
    async signup(@Body() user: any) {
        const { confirmPassword, ...newUser } = user;
        return this.authService.signup(newUser, confirmPassword);
    }


    @Post('login')
    async login(@Body() loginUser: any) {
        const { email, password } = loginUser;
        return this.authService.login(loginUser);
    }
}