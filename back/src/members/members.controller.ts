import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MembersService } from './members.service';


@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

}
