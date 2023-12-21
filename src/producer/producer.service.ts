import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PaginationService } from 'src/pagination/pagination.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { EnumSort, QueryDto } from 'src/query-dto/query.dto'
import { generateSlug } from 'src/utils/generate-slug'
import { UpdateProducerDto } from './dto/update-producer.dto'
import { producerDtoObject } from './object/producer-dto.object'
import { producerFullestObject, producerObject } from './object/producer.object'

@Injectable()
export class ProducerService {
	constructor(
		private prisma: PrismaService,
		private paginationService: PaginationService
	) {}

	async getAll(dto: QueryDto = {}) {
		const { perPage, skip } = this.paginationService.getPagination(dto)

		const filters = this.createFilter(dto)

		const producers = await this.prisma.producer.findMany({
			where: filters,
			orderBy: this.getSortOption(dto.sort),
			skip,
			take: perPage,
			select: producerObject,
		})

		return {
			persons: producers,
			length: await this.prisma.producer.count({
				where: filters,
			}),
		}
	}

	async bySlug(slug: string) {
		const producer = await this.prisma.producer.findUnique({
			where: {
				slug,
				isVisible: true,
			},
			select: producerFullestObject,
		})

		if (!producer) throw new NotFoundException('Producer not found')

		return producer
	}

	private getSortOption(
		sort: EnumSort
	): Prisma.ProducerOrderByWithRelationInput[] {
		switch (sort) {
			case EnumSort.NEWEST:
				return [{ createdAt: 'desc' }]
			case EnumSort.OLDEST:
				return [{ createdAt: 'asc' }]
			default:
				return [{ createdAt: 'desc' }]
		}
	}

	private createFilter(dto: QueryDto): Prisma.ProducerWhereInput {
		const filters: Prisma.ProducerWhereInput[] = []

		if (dto.searchTerm) filters.push(this.getSearchTermFilter(dto.searchTerm))

		if (dto.media) filters.push(this.getMediaFilter(dto.media.split('|')))
		if (dto.isVisible) {
			filters.push(this.getVisibleFilter(dto.isVisible))
		}

		return filters.length ? { AND: filters } : {}
	}

	private getSearchTermFilter(searchTerm: string): Prisma.ProducerWhereInput {
		return {
			name: {
				contains: searchTerm,
				mode: 'insensitive',
			},
		}
	}

	private getVisibleFilter(isVisible: string): Prisma.ProducerWhereInput {
		return {
			isVisible: !!isVisible,
		}
	}

	private getMediaFilter(media: string[]): Prisma.ProducerWhereInput {
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
		const producer = await this.prisma.producer.findUnique({
			where: {
				id,
			},
			select: producerDtoObject,
		})

		if (!producer) throw new NotFoundException('Producer not found')

		return producer
	}

	async toggleVisibility(id: number) {
		const producer = await this.byId(id)

		const isExists = producer.isVisible

		return this.prisma.producer.update({
			where: {
				id,
			},
			data: {
				isVisible: isExists ? false : true,
			},
		})
	}

	async create() {
		const producer = await this.prisma.producer.create({
			data: {
				name: '',
				slug: '',
			},
		})

		return producer.id
	}

	async update(id: number, dto: UpdateProducerDto) {
		return this.prisma.producer.update({
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
		return this.prisma.producer.delete({
			where: {
				id,
			},
		})
	}
}
