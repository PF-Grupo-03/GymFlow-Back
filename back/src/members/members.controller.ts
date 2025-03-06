import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MembersService } from './members.service';
import { AuthGuard } from 'src/auth/guards/auth.guards';
import { Roles } from 'src/decorators/roles.decorators';
import { UserRole } from "src/enum/roles.enum"
import { RolesGuard } from 'src/auth/guards/roles.guards';


@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}


  @Get()
  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles(UserRole.USER_ADMIN)
  getAllMembers() {
    return this.membersService.getAllMembers();
  }

  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles(UserRole.USER_ADMIN)
  @Get(':id')
  getMemberById(@Param('id') id: string) {
    return this.membersService.getMemberById(id);
  }

}
