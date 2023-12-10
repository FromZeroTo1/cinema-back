import { Module } from '@nestjs/common'
import { MovieService } from 'src/movie/movie.service'
import { PaginationService } from 'src/pagination/pagination.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { MediaController } from './media.controller'
import { MediaService } from './media.service'

@Module({
	controllers: [MediaController],
	providers: [MediaService, PaginationService, PrismaService, MovieService],
})
export class MediaModule {}
