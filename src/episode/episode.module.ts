import { Module } from '@nestjs/common'
import { PaginationService } from 'src/pagination/pagination.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { EpisodeController } from './episode.controller'
import { EpisodeService } from './episode.service'

@Module({
	controllers: [EpisodeController],
	providers: [EpisodeService, PrismaService, PaginationService],
})
export class EpisodeModule {}
