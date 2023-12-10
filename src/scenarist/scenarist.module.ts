import { Module } from '@nestjs/common'
import { PaginationService } from 'src/pagination/pagination.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { ScenaristController } from './scenarist.controller'
import { ScenaristService } from './scenarist.service'

@Module({
	controllers: [ScenaristController],
	providers: [ScenaristService, PrismaService, PaginationService],
})
export class ScenaristModule {}
