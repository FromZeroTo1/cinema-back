import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PaginationService } from 'src/pagination/pagination.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { EnumSort, QueryDto } from 'src/query-dto/query.dto'
import { PromocodeCodeDto } from './dto/promocode-code.dto'
import { QueryPromocodeDto } from './dto/query-promocode.dto'
import { UpdatePromocodeDto } from './dto/update-promocode.dto'
import { promocodeDtoObject } from './object/promocode-dto.object'
import { promocodeObject } from './object/promocode.object'

@Injectable()
export class PromocodeService {
	constructor(
		private prisma: PrismaService,
		private paginationService: PaginationService
	) {}

	async getAll(dto: QueryPromocodeDto = {}) {
		const { perPage, skip } = this.paginationService.getPagination(dto)

		const filters = this.createFilter(dto)

		const promocodes = await this.prisma.promocode.findMany({
			where: filters,
			orderBy: this.getSortOption(dto.sort),
			skip,
			take: perPage,
			select: promocodeObject,
		})

		return {
			promocodes,
			length: await this.prisma.promocode.count({
				where: filters,
			}),
		}
	}

	async byCode({ code }: PromocodeCodeDto) {
		return this.prisma.promocode.findUnique({
			where: {
				code,
			},
			select: promocodeObject,
		})
	}

	private getSortOption(
		sort: EnumSort
	): Prisma.PromocodeOrderByWithRelationInput[] {
		switch (sort) {
			case EnumSort.NEWEST:
				return [{ createdAt: 'desc' }]
			case EnumSort.OLDEST:
				return [{ createdAt: 'asc' }]
			default:
				return [{ createdAt: 'desc' }]
		}
	}

	private createFilter(dto: QueryDto): Prisma.PromocodeWhereInput {
		const filters: Prisma.PromocodeWhereInput[] = []

		if (dto.searchTerm) filters.push(this.getSearchTermFilter(dto.searchTerm))

		if (dto.isVisible) {
			filters.push(this.getVisibleFilter(dto.isVisible))
		}

		return filters.length ? { AND: filters } : {}
	}

	private getSearchTermFilter(searchTerm: string): Prisma.PromocodeWhereInput {
		return {
			OR: [
				{
					code: {
						contains: searchTerm,
						mode: 'insensitive',
					},
				},
				{
					description: {
						contains: searchTerm,
						mode: 'insensitive',
					},
				},
			],
		}
	}

	private getVisibleFilter(isVisible: string): Prisma.PromocodeWhereInput {
		return {
			isVisible: !!isVisible,
		}
	}

	// Admin Place

	async byId(id: number) {
		const promocode = await this.prisma.promocode.findUnique({
			where: {
				id,
			},
			select: promocodeDtoObject,
		})

		if (!promocode) throw new NotFoundException('Promocode not found')

		return promocode
	}

	async toggleVisibility(id: number) {
		const promocode = await this.byId(id)

		const isExists = promocode.isVisible

		return this.prisma.promocode.update({
			where: {
				id,
			},
			data: {
				isVisible: isExists ? false : true,
			},
		})
	}

	async create() {
		const promocode = await this.prisma.promocode.create({
			data: {
				sale: undefined,
				code: '',
			},
		})

		return promocode.id
	}

	async update(id: number, dto: UpdatePromocodeDto) {
		return this.prisma.promocode.update({
			where: {
				id,
			},
			data: {
				sale: dto.sale,
				code: dto.code,
				description: dto.description,
				expiresAt: dto.expiresAt,
				isVisible: true,
			},
		})
	}

	async delete(id: number) {
		return this.prisma.promocode.delete({
			where: {
				id,
			},
		})
	}
}
