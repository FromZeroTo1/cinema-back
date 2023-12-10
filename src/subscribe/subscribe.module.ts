import { Module } from '@nestjs/common'
import { SubscribeController } from './subscribe.controller'
import { SubscribeService } from './subscribe.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { TariffService } from 'src/tariff/tariff.service'
import { PromocodeService } from 'src/promocode/promocode.service'
import { PaginationService } from 'src/pagination/pagination.service'

@Module({
	controllers: [SubscribeController],
	providers: [SubscribeService, PrismaService, TariffService, PromocodeService, PaginationService],
})
export class SubscribeModule {}
