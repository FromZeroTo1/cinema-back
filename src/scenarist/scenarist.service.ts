import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PaginationService } from 'src/pagination/pagination.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { EnumSort, QueryDto } from 'src/query-dto/query.dto'
import { generateSlug } from 'src/utils/generate-slug'
import { UpdateScenaristDto } from './dto/update-scenarist.dto'
import { scenaristDtoObject } from './object/scenarist-dto.object'
import {
	scenaristFullestObject,
	scenaristObject,
} from './object/scenarist.object'

@Injectable()
export class ScenaristService {
	constructor(
		private prisma: PrismaService,
		private paginationService: PaginationService
	) {}

	async getAll(dto: QueryDto = {}) {
		const { perPage, skip } = this.paginationService.getPagination(dto)

		const filters = this.createFilter(dto)

		const scenarists = await this.prisma.scenarist.findMany({
			where: filters,
			orderBy: this.getSortOption(dto.sort),
			skip,
			take: perPage,
			select: scenaristObject,
		})

		return {
			persons: scenarists,
			length: await this.prisma.scenarist.count({
				where: filters,
			}),
		}
	}

	async bySlug(slug: string) {
		const scenarist = await this.prisma.scenarist.findUnique({
			where: {
				slug,
				isVisible: true,
			},
			select: scenaristFullestObject,
		})

		if (!scenarist) throw new NotFoundException('Scenarist not found')

		return scenarist
	}

	private getSortOption(
		sort: EnumSort
	): Prisma.ScenaristOrderByWithRelationInput[] {
		switch (sort) {
			case EnumSort.NEWEST:
				return [{ createdAt: 'desc' }]
			case EnumSort.OLDEST:
				return [{ createdAt: 'asc' }]
			default:
				return [{ createdAt: 'desc' }]
		}
	}

	private createFilter(dto: QueryDto): Prisma.ScenaristWhereInput {
		const filters: Prisma.ScenaristWhereInput[] = []

		if (dto.searchTerm) filters.push(this.getSearchTermFilter(dto.searchTerm))

		if (dto.media) filters.push(this.getMediaFilter(dto.media.split('|')))
		if (dto.visible) filters.push(this.getVisibleFilter(dto.visible || true))

		return filters.length ? { AND: filters } : {}
	}

	private getSearchTermFilter(searchTerm: string): Prisma.ScenaristWhereInput {
		return {
			name: {
				contains: searchTerm,
				mode: 'insensitive',
			},
		}
	}

	private getVisibleFilter(visibility: boolean): Prisma.ScenaristWhereInput {
		return {
			isVisible: visibility,
		}
	}

	private getMediaFilter(media: string[]): Prisma.ScenaristWhereInput {
		return {
			media: {
				some: {
					slug: {
						in: media,
					},
				},
			},
		}
	}

	// Admin Place

	async byId(id: number) {
		const scenarist = await this.prisma.scenarist.findUnique({
			where: {
				id,
			},
			select: scenaristDtoObject,
		})

		if (!scenarist) throw new NotFoundException('Scenarist not found')

		return scenarist
	}

	async toggleVisibility(id: number) {
		const scenarist = await this.byId(id)

		const isExists = scenarist.isVisible

		return this.prisma.scenarist.update({
			where: {
				id,
			},
			data: {
				isVisible: isExists ? false : true,
			},
		})
	}

	async create() {
		const scenarist = await this.prisma.scenarist.create({
			data: {
				name: '',
				slug: '',
			},
		})

		return scenarist.id
	}

	async update(id: number, dto: UpdateScenaristDto) {
		return this.prisma.scenarist.update({
			where: {
				id,
			},
			data: {
				name: dto.name,
				slug: generateSlug(dto.name),
				photo: dto.photo,
				isVisible: true,
			},
		})
	}

	async delete(id: number) {
		return this.prisma.scenarist.delete({
			where: {
				id,
			},
		})
	}
}
