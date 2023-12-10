import { Module } from '@nestjs/common';
import { PromocodeService } from './promocode.service';
import { PromocodeController } from './promocode.controller';
import { PrismaService } from 'src/prisma/prisma.service'
import { PaginationService } from 'src/pagination/pagination.service'

@Module({
  controllers: [PromocodeController],
  providers: [PromocodeService, PrismaService, PaginationService],
})
export class PromocodeModule {}
