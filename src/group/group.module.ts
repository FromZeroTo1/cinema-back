import { Module } from '@nestjs/common'
import { MediaService } from 'src/media/media.service'
import { MovieService } from 'src/movie/movie.service'
import { PaginationService } from 'src/pagination/pagination.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { GroupController } from './group.controller'
import { GroupService } from './group.service'

@Module({
	controllers: [GroupController],
	providers: [
		GroupService,
		PrismaService,
		PaginationService,
		MediaService,
		MovieService,
	],
})
export class GroupModule {}
