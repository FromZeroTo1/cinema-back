import { Module } from '@nestjs/common'
import { PaginationService } from 'src/pagination/pagination.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { ActorController } from './actor.controller'
import { ActorService } from './actor.service'

@Module({
	controllers: [ActorController],
	providers: [ActorService, PrismaService, PaginationService],
})
export class ActorModule {}
