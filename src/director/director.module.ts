import { Module } from '@nestjs/common'
import { PaginationService } from 'src/pagination/pagination.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { DirectorController } from './director.controller'
import { DirectorService } from './director.service'

@Module({
	controllers: [DirectorController],
	providers: [DirectorService, PrismaService, PaginationService],
})
export class DirectorModule {}
