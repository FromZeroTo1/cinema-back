import { Module } from '@nestjs/common'
import { PaginationService } from 'src/pagination/pagination.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { OperatorController } from './operator.controller'
import { OperatorService } from './operator.service'

@Module({
	controllers: [OperatorController],
	providers: [OperatorService, PrismaService, PaginationService],
})
export class OperatorModule {}
