import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PaginationService } from 'src/pagination/pagination.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { EnumSort } from 'src/query-dto/query.dto'
import { EpisodeQueryDto } from './dto/query-episode.dto'
import { UpdateEpisodeDto } from './dto/update-episode.dto'
import { episodeDtoObject } from './object/episode-dto.object'
import { episodeObject } from './object/episode.object'

@Injectable()
export class EpisodeService {
	constructor(
		private prisma: PrismaService,
		private paginationService: PaginationService
	) {}

	async getAll(dto: EpisodeQueryDto) {
		const { perPage, skip } = this.paginationService.getPagination(dto)

		const filters = this.createFilter(dto)

		const episodes = await this.prisma.episode.findMany({
			where: filters,
			orderBy: this.getSortOption(dto.sort),
			skip,
			take: perPage,
			select: episodeObject,
		})

		return {
			episodes,
			length: await this.prisma.episode.count({
				where: filters,
			}),
		}
	}

	private getSortOption(
		sort: EnumSort
	): Prisma.EpisodeOrderByWithRelationInput[] {
		switch (sort) {
			case EnumSort.NEWEST:
				return [{ createdAt: 'desc' }]
			case EnumSort.OLDEST:
				return [{ createdAt: 'asc' }]
			default:
				return [{ createdAt: 'desc' }]
		}
	}

	private createFilter(dto: EpisodeQueryDto): Prisma.EpisodeWhereInput {
		const filters: Prisma.EpisodeWhereInput[] = []

		filters.push(this.getSeasonFilter(dto.seasonId))

		if (dto.searchTerm) filters.push(this.getSearchTermFilter(dto.searchTerm))

		if (dto.isVisible) {
			filters.push(this.getVisibleFilter(dto.isVisible))
		} else {
			filters.push(this.getVisibleFilter('true'))
		}

		return filters.length ? { AND: filters } : {}
	}

	private getSearchTermFilter(searchTerm: string): Prisma.EpisodeWhereInput {
		const searchTermAsNumber = parseInt(searchTerm, 10)

		if (!isNaN(searchTermAsNumber)) {
			return {
				OR: [
					{
						number: {
							equals: searchTermAsNumber,
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
		} else {
			return {
				description: {
					contains: searchTerm,
					mode: 'insensitive',
				},
			}
		}
	}

	private getSeasonFilter(seasonId: string): Prisma.EpisodeWhereInput {
		return {
			seasonId: +seasonId,
		}
	}

	private getVisibleFilter(isVisible: string): Prisma.EpisodeWhereInput {
		return {
			isVisible: !!isVisible,
		}
	}

	// Admin Place

	async byId(id: number) {
		const episode = await this.prisma.episode.findUnique({
			where: {
				id,
			},
			select: episodeDtoObject,
		})

		if (!episode) throw new NotFoundException('Episode not found')

		return episode
	}

	async toggleVisibility(id: number) {
		const episode = await this.byId(id)

		const isExists = episode.isVisible

		return this.prisma.episode.update({
			where: {
				id,
			},
			data: {
				isVisible: isExists ? false : true,
			},
		})
	}

	async create(id: number) {
		const episode = await this.prisma.episode.create({
			data: {
				number: 0,
				excerpt: '',
				description: '',
				poster: '',
				bigPoster: '',
				duration: 0,
				trailers: {
					create: {
						language: '',
						items: {
							create: {
								quality: '',
								url: '',
							},
						},
					},
				},
				videos: {
					create: {
						language: '',
						items: {
							create: {
								quality: '',
								url: '',
							},
						},
					},
				},
				releaseDate: '',
				season: {
					connect: {
						id,
					},
				},
			},
		})

		return episode.id
	}

	async update(id: number, dto: UpdateEpisodeDto) {
		return this.prisma.episode.update({
			where: {
				id,
			},
			data: {
				number: dto.number,
				excerpt: dto.excerpt,
				description: dto.description,
				poster: dto.poster,
				bigPoster: dto.bigPoster,
				duration: dto.duration,
				trailers: {
					deleteMany: {},
					create: dto.trailers.map((trailer) => ({
						language: trailer.language,
						items: {
							create: trailer.items.map((item) => ({
								quality: item.quality,
								url: item.url,
							})),
						},
					})),
				},
				videos: {
					deleteMany: {},
					create: dto.videos.map((video) => ({
						language: video.language,
						items: {
							create: video.items.map((item) => ({
								quality: item.quality,
								url: item.url,
							})),
						},
					})),
				},
				releaseDate: dto.releaseDate,
				isVisible: true,
			},
		})
	}

	async delete(id: number) {
		return this.prisma.episode.delete({
			where: {
				id,
			},
		})
	}
}
