import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PaginationService } from 'src/pagination/pagination.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { EnumSort, QueryDto } from 'src/query-dto/query.dto'
import { generateSlug } from 'src/utils/generate-slug'
import { UpdateDirectorDto } from './dto/update-director.dto'
import { directorDtoObject } from './object/director-dto.object'
import { directorFullestObject, directorObject } from './object/director.object'

@Injectable()
export class DirectorService {
	constructor(
		private prisma: PrismaService,
		private paginationService: PaginationService
	) {}

	async getAll(dto: QueryDto = {}) {
		const { perPage, skip } = this.paginationService.getPagination(dto)

		const filters = this.createFilter(dto)

		const directors = await this.prisma.director.findMany({
			where: filters,
			orderBy: this.getSortOption(dto.sort),
			skip,
			take: perPage,
			select: directorObject,
		})

		return {
			persons: directors,
			length: await this.prisma.director.count({
				where: filters,
			}),
		}
	}

	async bySlug(slug: string) {
		const director = await this.prisma.director.findUnique({
			where: {
				slug,
				isVisible: true,
			},
			select: directorFullestObject,
		})

		if (!director) throw new NotFoundException('Director not found')

		return director
	}

	private getSortOption(
		sort: EnumSort
	): Prisma.DirectorOrderByWithRelationInput[] {
		switch (sort) {
			case EnumSort.NEWEST:
				return [{ createdAt: 'desc' }]
			case EnumSort.OLDEST:
				return [{ createdAt: 'asc' }]
			default:
				return [{ createdAt: 'desc' }]
		}
	}

	private createFilter(dto: QueryDto): Prisma.DirectorWhereInput {
		const filters: Prisma.DirectorWhereInput[] = []

		if (dto.searchTerm) filters.push(this.getSearchTermFilter(dto.searchTerm))

		if (dto.media) filters.push(this.getMediaFilter(dto.media.split('|')))
		if (dto.visible) filters.push(this.getVisibleFilter(dto.visible || true))

		return filters.length ? { AND: filters } : {}
	}

	private getSearchTermFilter(searchTerm: string): Prisma.DirectorWhereInput {
		return {
			name: {
				contains: searchTerm,
				mode: 'insensitive',
			},
		}
	}

	private getVisibleFilter(visibility: boolean): Prisma.DirectorWhereInput {
		return {
			isVisible: visibility,
		}
	}

	private getMediaFilter(media: string[]): Prisma.DirectorWhereInput {
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
		const director = await this.prisma.director.findUnique({
			where: {
				id,
			},
			select: directorDtoObject,
		})

		if (!director) throw new NotFoundException('Director not found')

		return director
	}

	async toggleVisibility(id: number) {
		const director = await this.byId(id)

		const isExists = director.isVisible

		return this.prisma.director.update({
			where: {
				id,
			},
			data: {
				isVisible: isExists ? false : true,
			},
		})
	}

	async create() {
		const director = await this.prisma.director.create({
			data: {
				name: '',
				slug: '',
			},
		})

		return director.id
	}

	async update(id: number, dto: UpdateDirectorDto) {
		return this.prisma.director.update({
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
		return this.prisma.director.delete({
			where: {
				id,
			},
		})
	}
}
