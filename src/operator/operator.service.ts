import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PaginationService } from 'src/pagination/pagination.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { EnumSort, QueryDto } from 'src/query-dto/query.dto'
import { generateSlug } from 'src/utils/generate-slug'
import { UpdateOperatorDto } from './dto/update-operator.dto'
import { operatorDtoObject } from './object/operator-dto.object'
import { operatorFullestObject, operatorObject } from './object/operator.object'

@Injectable()
export class OperatorService {
	constructor(
		private prisma: PrismaService,
		private paginationService: PaginationService
	) {}

	async getAll(dto: QueryDto = {}) {
		const { perPage, skip } = this.paginationService.getPagination(dto)

		const filters = this.createFilter(dto)

		const operators = await this.prisma.operator.findMany({
			where: filters,
			orderBy: this.getSortOption(dto.sort),
			skip,
			take: perPage,
			select: operatorObject,
		})

		return {
			persons: operators,
			length: await this.prisma.operator.count({
				where: filters,
			}),
		}
	}

	async bySlug(slug: string) {
		const operator = await this.prisma.operator.findUnique({
			where: {
				slug,
				isVisible: true,
			},
			select: operatorFullestObject,
		})

		if (!operator) throw new NotFoundException('Operator not found')

		return operator
	}

	private getSortOption(
		sort: EnumSort
	): Prisma.OperatorOrderByWithRelationInput[] {
		switch (sort) {
			case EnumSort.NEWEST:
				return [{ createdAt: 'desc' }]
			case EnumSort.OLDEST:
				return [{ createdAt: 'asc' }]
			default:
				return [{ createdAt: 'desc' }]
		}
	}

	private createFilter(dto: QueryDto): Prisma.OperatorWhereInput {
		const filters: Prisma.OperatorWhereInput[] = []

		if (dto.searchTerm) filters.push(this.getSearchTermFilter(dto.searchTerm))

		if (dto.media) filters.push(this.getMediaFilter(dto.media.split('|')))
		if (dto.isVisible) {
			filters.push(this.getVisibleFilter(dto.isVisible))
		} else {
			filters.push(this.getVisibleFilter('true'))
		}

		return filters.length ? { AND: filters } : {}
	}

	private getSearchTermFilter(searchTerm: string): Prisma.OperatorWhereInput {
		return {
			name: {
				contains: searchTerm,
				mode: 'insensitive',
			},
		}
	}

	private getVisibleFilter(isVisible: string): Prisma.OperatorWhereInput {
		return {
			isVisible: !!isVisible,
		}
	}

	private getMediaFilter(media: string[]): Prisma.OperatorWhereInput {
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
		const operator = await this.prisma.operator.findUnique({
			where: {
				id,
			},
			select: operatorDtoObject,
		})

		if (!operator) throw new NotFoundException('Operator not found')

		return operator
	}

	async toggleVisibility(id: number) {
		const operator = await this.byId(id)

		const isExists = operator.isVisible

		return this.prisma.operator.update({
			where: {
				id,
			},
			data: {
				isVisible: isExists ? false : true,
			},
		})
	}

	async create() {
		const operator = await this.prisma.operator.create({
			data: {
				name: '',
				slug: '',
			},
		})

		return operator.id
	}

	async update(id: number, dto: UpdateOperatorDto) {
		return this.prisma.operator.update({
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
		return this.prisma.operator.delete({
			where: {
				id,
			},
		})
	}
}
