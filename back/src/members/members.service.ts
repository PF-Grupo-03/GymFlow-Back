import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';


@Injectable()
export class MembersService {
    constructor(private readonly prisma: PrismaService) {}

    async getAllMembers() {
      return await this.prisma.member.findMany({
        include: {
            user: true
        }
      });
    }

    async getMemberById(id: string)
    {
        const member = await this.prisma.member.findUnique({
            where: {
                id: id
            },
            include: {
                user: true
            }
        });

        if(!member)
        {
            throw new NotFoundException('Miembro no encontrado');
        }

        return member;
    }

}
