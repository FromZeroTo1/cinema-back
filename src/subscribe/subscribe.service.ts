import { Injectable } from '@nestjs/common'
import { EnumSubscribeStatus } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { PromocodeService } from 'src/promocode/promocode.service'
import { TariffService } from 'src/tariff/tariff.service'
import * as YooKassa from 'yookassa'
import { BuySubscribeDto } from './dto/buy-subscribe.dto'
import { PaymentStatusDto } from './dto/payment-status.dto'

const yooKassa = new YooKassa({
	shopId: process.env['SHOP_ID'],
	secretKey: process.env['PAYMENT_TOKEN'],
})

@Injectable()
export class SubscribeService {
	constructor(
		private prisma: PrismaService,
		private tariffService: TariffService,
		private promocodeService: PromocodeService
	) {}

	async placeOrder(dto: BuySubscribeDto, userId: number) {
		const tariff = await this.tariffService.byId(dto.tariffId)
		const promocode = await this.promocodeService.byCode({
			code: dto.promocode,
		})

		const price = tariff.salePrice ? tariff.salePrice : tariff.price

		const total = price - (price * promocode.sale) / 100

		const subscribe = await this.prisma.subscribe.create({
			data: {
				status: dto.status,
				tariff: {
					connect: {
						id: dto.tariffId,
					},
				},
				user: {
					connect: {
						id: userId,
					},
				},
			},
		})

		const payment = await yooKassa.createPayment({
			amount: {
				value: total.toFixed(2),
				currency: 'RUB',
			},
			payment_method_data: {
				type: 'bank_card',
			},
			confirmation: {
				type: 'redirect',
				return_url: 'http://localhost:3000/thanks',
			},
			description: `Subscribe From Cinema #${subscribe.id}`,
		})

		return payment
	}

	async updateStatus(dto: PaymentStatusDto) {
		if (dto.event === 'payment.waiting_for_capture') {
			const payment = await yooKassa.capturePayment(dto.object.id)
			return payment
		}

		if (dto.event === 'payment.succeeded') {
			const subscribeId = Number(dto.object.description.split('#'[1]))

			await this.prisma.subscribe.update({
				where: {
					id: subscribeId,
				},
				data: {
					status: EnumSubscribeStatus.PAYED,
				},
			})

			return true
		}

		return true
	}

	async delete(id: number) {
		return this.prisma.subscribe.delete({
			where: {
				id,
			},
		})
	}
}
