import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto, loginUserDto } from "src/users/users.dto";


@Controller('auth')
export class AuthController {
    constructor( private readonly authService: AuthService) {}

    @Post('signup')
    async signup(@Body() user: CreateUserDto ) {
        const formattedBDate = new Date(user.bDate);
        if (isNaN(formattedBDate.getTime())) {
            throw new BadRequestException('bDate must be a valid date');
        }

        const { confirmPassword, ...newUser } = user;
        
        return this.authService.signup(newUser);
    }


    @Post('signin')
    async signin(@Body() loginUser: loginUserDto) {
        const { email, password } = loginUser;
        const token = await this.authService.signin(email, password);
        if (!token) {
            throw new BadRequestException('La contraseña o el email son incorrectos');
        }

        return { message: 'Inicio de sesión con éxito', token };
    }
}