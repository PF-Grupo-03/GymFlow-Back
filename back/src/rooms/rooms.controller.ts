import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto, UpdateRoomDto } from './rooms.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guards';
import { TrainerGuard } from 'src/guards/trainer.guards';
import { RolesGuard } from 'src/guards/roles.guards';
import { Roles } from 'src/decorators/roles.decorators';
import { UserRole } from 'src/enum/roles.enum';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @ApiBearerAuth()
  @Post('register')
  @UseGuards(AuthGuard, TrainerGuard)
  createRoom(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.createRoom(createRoomDto);
  }

  @ApiBearerAuth()
  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.USER_PREMIUM, UserRole.USER_DIAMOND)
  findAll() {
    return this.roomsService.findAll();
  }

  @ApiBearerAuth()
  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.USER_PREMIUM, UserRole.USER_DIAMOND)
  findOneById(@Param('id') id: string) {
    return this.roomsService.findOneById(id);
  }

  @ApiBearerAuth()
  @Get('name/:name')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.USER_PREMIUM, UserRole.USER_DIAMOND)
  findOneByName(@Param('name') name: string) {
    return this.roomsService.findOneByName(name);
  }

  @ApiBearerAuth()
  @Patch('update/:id')
  @UseGuards(AuthGuard, TrainerGuard)
  updateRoom(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.updateRoom(id, updateRoomDto);
  }

  @ApiBearerAuth()
  @Delete('delete/:id')
  @UseGuards(AuthGuard, TrainerGuard)
  softDeleteRoom(@Param('id') id: string) {
    return this.roomsService.softDeleteRoom(id);
  }
}
