import { Injectable, NotFoundException } from '@nestjs/common'
import { tariffObject } from './object/tariff.object'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class TariffService {
	constructor(private prisma: PrismaService) {}

	async byId(id: number) {
		const tariff = await this.prisma.tariff.findUnique({
			where: {
				id,
			},
			select: tariffObject,
		})

		if (!tariff) throw new NotFoundException('Tariff not found')

		return tariff
	}

	async toggleVisibility(id: number) {
		const tariff = await this.byId(id)

		const isExists = tariff.isVisible

		return this.prisma.tariff.update({
			where: {
				id,
			},
			data: {
				isVisible: isExists ? false : true
			},
		})
	}
}
