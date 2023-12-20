import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { UpdateCardDto } from './dto/update-card.dto'
import { cardDtoObject } from './object/card-dto.object'

@Injectable()
export class CardService {
	constructor(private prisma: PrismaService) {}

	// Admin Place

	async byId(id: number) {
		const card = await this.prisma.card.findUnique({
			where: {
				id,
			},
			select: cardDtoObject,
		})

		if (!card) throw new NotFoundException('Card not found')

		return card
	}

	async create() {
		const card = await this.prisma.card.create({
			data: {
				number: '',
				owner: '',
				month: undefined,
				year: undefined,
				cvv: undefined,
			},
		})

		return card.id
	}

	async update(id: number, dto: UpdateCardDto) {
		return this.prisma.card.update({
			where: {
				id,
			},
			data: {
				number: dto.number,
				owner: dto.owner,
				month: dto.month,
				year: dto.year,
				cvv: dto.cvv,
				isMain: dto.isMain,
			},
		})
	}

	async delete(id: number) {
		return this.prisma.card.delete({
			where: {
				id,
			},
		})
	}
}
