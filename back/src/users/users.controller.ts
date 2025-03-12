import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from 'src/decorators/roles.decorators';
import { RolesGuard } from 'src/guards/roles.guards';
import { CreateUserDto } from './dtos/users.dto';
import { ApproveTrainerDto } from './dtos/approveTrainer.dto';
import { UserRole } from 'src/enum/roles.enum';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { TrainerGuard } from 'src/guards/trainer.guards';
import { AuthGuard } from 'src/guards/auth.guards';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

    @ApiBearerAuth()
    @Get()
    @UseGuards(AuthGuard, TrainerGuard)
    getAllUsers() {
      return this.usersService.getAllUsers();
    }

    @ApiBearerAuth()
    @Get(':id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.USER_ADMIN, UserRole.USER_BASIC, UserRole.USER_PREMIUM, UserRole.USER_DIAMOND, UserRole.USER_TRAINING)
    getUserById(@Param('id') id: string) {
      return this.usersService.getUserById(id);
    }

    @ApiBearerAuth()
    @Put('update-user/:id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.USER_ADMIN, UserRole.USER_MEMBER, UserRole.USER_BASIC, UserRole.USER_PREMIUM, UserRole.USER_DIAMOND, UserRole.USER_TRAINING)
    updateUser(@Param('id') id: string, @Body() user: Partial<CreateUserDto>) {
      return this.usersService.updateUser(id, user);
    }

    @ApiBearerAuth()
    @Get('email/:email')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.USER_ADMIN, UserRole.USER_BASIC, UserRole.USER_PREMIUM, UserRole.USER_DIAMOND, UserRole.USER_TRAINING)
    findUserByEmail(@Param('email') email: string) {
      return this.usersService.findUserByEmail(email);
    }

    @ApiBearerAuth()
    @Patch('approve-trainer/:id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.USER_ADMIN)
    approveTrainer(@Param('id') id: string, @Body() dto: ApproveTrainerDto) {
      return this.usersService.approveTrainer(id, dto);
    }

    @ApiBearerAuth()
    @Patch('update-google/:id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.USER_ADMIN, UserRole.USER_MEMBER, UserRole.USER_BASIC, UserRole.USER_PREMIUM, UserRole.USER_DIAMOND, UserRole.USER_TRAINING)
    updateUserAuthGoogle(@Param('id') id: string, @Body() user: UpdateUserDto) {
    return this.usersService.updateUserAuthGoogle(id, user);
  }

}
