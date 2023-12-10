import { Module } from '@nestjs/common'
import { MediaService } from 'src/media/media.service'
import { MovieService } from 'src/movie/movie.service'
import { PaginationService } from 'src/pagination/pagination.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { EpisodeController } from './episode.controller'
import { EpisodeService } from './episode.service'

@Module({
	controllers: [EpisodeController],
	providers: [
		EpisodeService,
		PrismaService,
		MovieService,
		MediaService,
		PaginationService,
	],
})
export class EpisodeModule {}
