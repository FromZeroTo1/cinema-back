import { Module } from '@nestjs/common'
import { PaginationService } from 'src/pagination/pagination.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { SeasonController } from './season.controller'
import { SeasonService } from './season.service'

@Module({
	controllers: [SeasonController],
	providers: [SeasonService, PrismaService, PaginationService],
})
export class SeasonModule {}
