import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { UpdateSeasonDto } from './dto/update-season.dto'
import { seasonDtoObject } from './object/season-dto.object'
import { seasonObject } from './object/season.object'

@Injectable()
export class SeasonService {
	constructor(private prisma: PrismaService) {}

	async getAll(mediaId: number) {
		const seasons = await this.prisma.season.findMany({
			where: {
				mediaId,
			},
			select: seasonObject,
		})

		return {
			seasons,
			length: await this.prisma.season.count({
				where: { mediaId },
			}),
		}
	}

	// Admin Place

	async byId(id: number) {
		const season = await this.prisma.season.findUnique({
			where: {
				id,
			},
			select: seasonDtoObject,
		})

		if (!season) throw new NotFoundException('Season not found')

		return season
	}

	async toggleVisibility(id: number) {
		const season = await this.byId(id)

		const isExists = season.isVisible

		return this.prisma.season.update({
			where: {
				id,
			},
			data: {
				isVisible: isExists ? false : true,
			},
		})
	}

	async create(id: number) {
		const season = await this.prisma.season.create({
			data: {
				number: 0,
				media: {
					connect: {
						id,
					},
				},
			},
		})

		return season.id
	}

	async update(id: number, dto: UpdateSeasonDto) {
		return this.prisma.season.update({
			where: {
				id,
			},
			data: {
				number: dto.number,
				isVisible: true,
			},
		})
	}

	async delete(id: number) {
		return this.prisma.season.delete({
			where: {
				id,
			},
		})
	}
}
