import { Module } from '@nestjs/common'
import { MediaService } from 'src/media/media.service'
import { PaginationService } from 'src/pagination/pagination.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { GenreController } from './genre.controller'
import { GenreService } from './genre.service'
import { MovieService } from 'src/movie/movie.service'

@Module({
	controllers: [GenreController],
	providers: [GenreService, PrismaService, PaginationService, MediaService, MovieService],
})
export class GenreModule {}
