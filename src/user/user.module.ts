import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma/prisma.service'
import { PaginationService } from 'src/pagination/pagination.service'

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, PaginationService],
})
export class UserModule {}
