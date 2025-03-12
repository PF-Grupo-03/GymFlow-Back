import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MembersService } from './members.service';
import { AuthGuard } from 'src/guards/auth.guards';
import { Roles } from 'src/decorators/roles.decorators';
import { UserRole } from "src/enum/roles.enum"
import { RolesGuard } from 'src/guards/roles.guards';
import { ApiBearerAuth } from '@nestjs/swagger';


@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @ApiBearerAuth()
  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.USER_ADMIN)
  getAllMembers() {
    return this.membersService.getAllMembers();
  }

  @ApiBearerAuth()
  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.USER_ADMIN, UserRole.USER_BASIC, UserRole.USER_PREMIUM, UserRole.USER_DIAMOND, UserRole.USER_TRAINING)
  getMemberById(@Param('id') id: string) {
    return this.membersService.getMemberById(id);
  }

}
