import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PaginationService } from 'src/pagination/pagination.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { EnumSort } from 'src/query-dto/query.dto'
import { SeasonQueryDto } from './dto/query-season.dto'
import { UpdateSeasonDto } from './dto/update-season.dto'
import { seasonDtoObject } from './object/season-dto.object'
import { seasonObject } from './object/season.object'

@Injectable()
export class SeasonService {
	constructor(
		private prisma: PrismaService,
		private paginationService: PaginationService
	) {}

	async getAll(dto: SeasonQueryDto) {
		const { perPage, skip } = this.paginationService.getPagination(dto)

		const filters = this.createFilter(dto)

		const seasons = await this.prisma.season.findMany({
			where: filters,
			orderBy: this.getSortOption(dto.sort),
			skip,
			take: perPage,
			select: seasonObject,
		})

		return {
			seasons,
			length: await this.prisma.season.count({
				where: filters,
			}),
		}
	}

	private getSortOption(
		sort: EnumSort
	): Prisma.SeasonOrderByWithRelationInput[] {
		switch (sort) {
			case EnumSort.NEWEST:
				return [{ createdAt: 'desc' }]
			case EnumSort.OLDEST:
				return [{ createdAt: 'asc' }]
			default:
				return [{ createdAt: 'desc' }]
		}
	}

	private createFilter(dto: SeasonQueryDto): Prisma.SeasonWhereInput {
		const filters: Prisma.SeasonWhereInput[] = []

		filters.push(this.getMediaFilter(dto.mediaId))

		if (dto.searchTerm) filters.push(this.getSearchTermFilter(dto.searchTerm))

		if (dto.isVisible) {
			filters.push(this.getVisibleFilter(dto.isVisible))
		} else {
			filters.push(this.getVisibleFilter('true'))
		}

		return filters.length ? { AND: filters } : {}
	}

	private getSearchTermFilter(searchTerm: string): Prisma.SeasonWhereInput {
		const searchTermAsNumber = parseInt(searchTerm, 10)

		return {
			OR: [
				{
					number: {
						equals: searchTermAsNumber,
					},
				},
			],
		}
	}

	private getMediaFilter(mediaId: string): Prisma.SeasonWhereInput {
		return {
			mediaId: +mediaId,
		}
	}

	private getVisibleFilter(isVisible: string): Prisma.SeasonWhereInput {
		return {
			isVisible: !!isVisible,
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
