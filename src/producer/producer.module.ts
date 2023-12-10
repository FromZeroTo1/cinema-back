import { Module } from '@nestjs/common'
import { PaginationService } from 'src/pagination/pagination.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { ProducerController } from './producer.controller'
import { ProducerService } from './producer.service'

@Module({
	controllers: [ProducerController],
	providers: [ProducerService, PrismaService, PaginationService],
})
export class ProducerModule {}
