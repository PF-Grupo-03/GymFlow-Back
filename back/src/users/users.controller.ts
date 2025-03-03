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
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { CreateUserDto } from './dtos/users.dto';
import { ApproveTrainerDto } from './dtos/approveTrainer.dto';
import { UserRole } from 'src/roles.enum';
import { UpdateUserDto } from './dtos/updateUser.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  getAllUsers() {
    return this.usersService.getAllUsers();
  }
  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Put('update-user/:id')
  updateUser(@Param('id') id: string, @Body() user: CreateUserDto) {
    return this.usersService.updateUser(id, user);
  }

  @Get('email/:email')
  findUserByEmail(@Param('email') email: string) {
    return this.usersService.findUserByEmail(email);
  }

  @Patch('approve-trainer/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.USER_ADMIN)
  approveTrainer(@Param('id') id: string, @Body() dto: ApproveTrainerDto) {
    return this.usersService.approveTrainer(id, dto);
  }

  @Put('update-google/:id')
  updateUserAuthGoogle(@Param('id') id: string, @Body() user: UpdateUserDto) {
  return this.usersService.updateUser(id, user);
}

}
