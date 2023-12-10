import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { generateSlug } from 'src/utils/generate-slug'
import { cardObject } from './object/card.object'
import { UpdateCardDto } from './dto/update-card.dto'

@Injectable()
export class CardService {
	constructor(private prisma: PrismaService) {}

	// Admin Place

	async byId(id: number) {
		const card = await this.prisma.card.findUnique({
			where: {
				id,
			},
			select: cardObject,
		})

		if (!card) throw new NotFoundException('Card not found')

		return card
	}

	async create(dto: UpdateCardDto) {
		return this.prisma.card.create({
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
