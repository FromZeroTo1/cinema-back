import { Module } from '@nestjs/common'
import { PaginationService } from 'src/pagination/pagination.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { MediaController } from './media.controller'
import { MediaService } from './media.service'

@Module({
	controllers: [MediaController],
	providers: [MediaService, PaginationService, PrismaService],
})
export class MediaModule {}
