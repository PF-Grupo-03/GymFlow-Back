// roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/enum/roles.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
