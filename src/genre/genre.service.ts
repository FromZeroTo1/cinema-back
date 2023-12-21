import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { MediaService } from 'src/media/media.service'
import { PaginationService } from 'src/pagination/pagination.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { EnumSort, QueryDto } from 'src/query-dto/query.dto'
import { generateSlug } from 'src/utils/generate-slug'
import { UpdateGenreDto } from './dto/update-genre.dto'
import { genreDtoObject } from './object/genre-dto.object'
import { genreFullestObject, genreObject } from './object/genre.object'

@Injectable()
export class GenreService {
	constructor(
		private prisma: PrismaService,
		private paginationService: PaginationService,
		private mediaService: MediaService
	) {}

	async getAll(dto: QueryDto = {}) {
		const { perPage, skip } = this.paginationService.getPagination(dto)

		const filters = this.createFilter(dto)

		const affiliations = await this.prisma.genre.findMany({
			where: filters,
			orderBy: this.getSortOption(dto.sort),
			skip,
			take: perPage,
			select: genreObject,
		})

		return {
			affiliations,
			length: await this.prisma.genre.count({
				where: filters,
			}),
		}
	}

	async getCollections() {
		const { affiliations } = await this.getAll()
		const collections = await Promise.all(
			affiliations.map(async (genre) => {
				const mediaByGenre = await this.mediaService.getAll({
					genre: genre.slug,
				})

				if (mediaByGenre.length > 0) {
					return {
						id: genre.id,
						name: genre.name,
						slug: genre.slug,
						image: mediaByGenre[0].bigPoster,
						mediaCount: mediaByGenre.length,
					}
				} else {
					return null
				}
			})
		)

		const filteredCollections = collections.filter(
			(collection) => collection !== null
		)

		return filteredCollections
	}

	async bySlug(slug: string) {
		const genre = await this.prisma.genre.findUnique({
			where: {
				slug,
				isVisible: true,
			},
			select: genreFullestObject,
		})

		if (!genre) throw new NotFoundException('Genre not found')

		return genre
	}

	private getSortOption(
		sort: EnumSort
	): Prisma.GenreOrderByWithRelationInput[] {
		switch (sort) {
			case EnumSort.NEWEST:
				return [{ createdAt: 'desc' }]
			case EnumSort.OLDEST:
				return [{ createdAt: 'asc' }]
			default:
				return [{ createdAt: 'desc' }]
		}
	}

	private createFilter(dto: QueryDto): Prisma.GenreWhereInput {
		const filters: Prisma.GenreWhereInput[] = []

		if (dto.searchTerm) filters.push(this.getSearchTermFilter(dto.searchTerm))

		if (dto.media) filters.push(this.getMediaFilter(dto.media.split('|')))
		if (dto.isVisible) {
			filters.push(this.getVisibleFilter(dto.isVisible))
		}

		return filters.length ? { AND: filters } : {}
	}

	private getSearchTermFilter(searchTerm: string): Prisma.GenreWhereInput {
		return {
			OR: [
				{
					name: {
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

	private getVisibleFilter(isVisible: string): Prisma.GenreWhereInput {
		return {
			isVisible: !!isVisible,
		}
	}

	private getMediaFilter(media: string[]): Prisma.GenreWhereInput {
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
		const genre = await this.prisma.genre.findUnique({
			where: {
				id,
			},
			select: genreDtoObject,
		})

		if (!genre) throw new NotFoundException('Genre not found')

		return genre
	}

	async toggleVisibility(id: number) {
		const genre = await this.byId(id)

		const isExists = genre.isVisible

		return this.prisma.genre.update({
			where: {
				id,
			},
			data: {
				isVisible: isExists ? false : true,
			},
		})
	}

	async create() {
		const genre = await this.prisma.genre.create({
			data: {
				name: '',
				slug: '',
			},
		})

		return genre.id
	}

	async update(id: number, dto: UpdateGenreDto) {
		return this.prisma.genre.update({
			where: {
				id,
			},
			data: {
				name: dto.name,
				slug: generateSlug(dto.name),
				description: dto.description,
				icon: dto.icon,
				isVisible: true,
			},
		})
	}

	async delete(id: number) {
		return this.prisma.genre.delete({
			where: {
				id,
			},
		})
	}
}
