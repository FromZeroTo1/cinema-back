import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { MovieService } from 'src/movie/movie.service'
import { PaginationService } from 'src/pagination/pagination.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { EnumSort, QueryDto } from 'src/query-dto/query.dto'
import { generateSlug } from 'src/utils/generate-slug'
import { MediaMovieViewsDto } from './dto/media-views.dto'
import { EnumMediaSort, QueryMediaDto } from './dto/query-media.dto'
import {
	UpdateMediaMovieDto,
	UpdateMediaSeasonsDto,
} from './dto/update-media.dto'
import { mediaObject } from './object/media.object'

@Injectable()
export class MediaService {
	constructor(
		private prisma: PrismaService,
		private paginationService: PaginationService,
		private movieService: MovieService
	) {}

	async getAll(dto: QueryMediaDto = {}) {
		const { perPage, skip } = this.paginationService.getPagination(dto)

		const filters = this.createFilter(dto)

		const media = await this.prisma.media.findMany({
			where: filters,
			orderBy: this.getAllSortOption(dto.sort),
			skip,
			take: perPage,
			select: {
				...mediaObject,
			},
		})

		return {
			media,
			length: await this.prisma.media.count({
				where: filters,
			}),
		}
	}

	async getMovies(dto: QueryDto = {}) {
		const { perPage, skip } = this.paginationService.getPagination(dto)

		const media = await this.prisma.media.findMany({
			where: {
				isMovie: true,
			},
			orderBy: this.getSortOption(dto.sort),
			skip,
			take: perPage,
			select: mediaObject,
		})

		return {
			media,
			length: await this.prisma.media.count({
				where: {
					isMovie: true,
				},
			}),
		}
	}

	async getSeries(dto: QueryDto = {}) {
		const { perPage, skip } = this.paginationService.getPagination(dto)

		const media = await this.prisma.media.findMany({
			where: {
				isSeries: true,
			},
			orderBy: this.getSortOption(dto.sort),
			skip,
			take: perPage,
			select: mediaObject,
		})

		return {
			media,
			length: await this.prisma.media.count({
				where: {
					isSeries: true,
				},
			}),
		}
	}

	async getSimilar(slug: string) {
		const currentMedia = await this.bySlug(slug)

		if (!currentMedia) throw new NotFoundException('Current media not found')

		const media = await this.prisma.media.findMany({
			where: {
				NOT: {
					slug: currentMedia.slug,
				},
				genres: {
					some: {
						slug: {
							in: currentMedia.genres.map((genre) => genre.slug),
						},
					},
				},
			},
			select: {
				...mediaObject,
			},
			orderBy: {
				createdAt: 'desc',
			},
		})

		return media
	}

	async bySlug(slug: string) {
		return this.prisma.media.findUnique({
			where: {
				slug,
				isVisible: true,
			},
			select: {
				...mediaObject,
			},
		})
	}

	async updateMediaMovieViews({ mediaSlug }: MediaMovieViewsDto) {
		return this.prisma.media.update({
			where: {
				slug: mediaSlug,
			},
			data: {
				totalViews: {
					increment: 1,
				},
			},
		})
	}

	async updateMediaSeriesViews(slug: string) {
		return this.prisma.media.update({
			where: {
				slug,
			},
			data: {
				totalViews: {
					increment: 1,
				},
			},
		})
	}

	private createFilter(dto: QueryMediaDto): Prisma.MediaWhereInput {
		const filters: Prisma.MediaWhereInput[] = []

		if (dto.searchTerm) filters.push(this.getSearchTermFilter(dto.searchTerm))

		if (dto.group) filters.push(this.getGroupFilter(dto.group.split('|')))
		if (dto.genre) filters.push(this.getGenreFilter(dto.genre.split('|')))
		if (dto.actor) filters.push(this.getActorFilter(dto.actor.split('|')))
		if (dto.director)
			filters.push(this.getDirectorFilter(dto.director.split('|')))
		if (dto.producer)
			filters.push(this.getProducerFilter(dto.producer.split('|')))
		if (dto.scenarist)
			filters.push(this.getScenaristFilter(dto.scenarist.split('|')))
		if (dto.operator)
			filters.push(this.getOperatorFilter(dto.operator.split('|')))
		if (dto.year) filters.push(this.getYearFilter(dto.year.split('|')))
		if (dto.age) filters.push(this.getAgeFilter(dto.age.split('|')))
		if (dto.country) filters.push(this.getCountryFilter(dto.country.split('|')))
		if (dto.visible) filters.push(this.getVisibleFilter(dto.visible || true))

		return filters.length ? { AND: filters } : {}
	}

	private getAllSortOption(
		sort: EnumMediaSort
	): Prisma.MediaOrderByWithRelationInput[] {
		switch (sort) {
			case EnumMediaSort.NEWEST:
				return [{ year: 'desc' }]
			case EnumMediaSort.OLDEST:
				return [{ year: 'asc' }]
			case EnumMediaSort.POPULAR:
				return [{ totalViews: 'desc' }]
			case EnumMediaSort.RATED:
				return [{ averageRating: 'desc' }]
			default:
				return [{ createdAt: 'desc' }]
		}
	}

	private getSearchTermFilter(searchTerm: string): Prisma.MediaWhereInput {
		return {
			OR: [
				{
					name: {
						contains: searchTerm,
						mode: 'insensitive',
					},
				},
				{
					genres: {
						some: {
							name: {
								contains: searchTerm,
								mode: 'insensitive',
							},
						},
					},
				},
			],
		}
	}

	private getGroupFilter(groups: string[]): Prisma.MediaWhereInput {
		return {
			groups: {
				some: {
					slug: {
						in: groups.map((group) => group),
					},
				},
			},
		}
	}

	private getGenreFilter(genres: string[]): Prisma.MediaWhereInput {
		return {
			genres: {
				some: {
					slug: {
						in: genres.map((genre) => genre),
					},
				},
			},
		}
	}

	private getActorFilter(actors: string[]): Prisma.MediaWhereInput {
		return {
			actors: {
				some: {
					slug: {
						in: actors.map((actor) => actor),
					},
				},
			},
		}
	}

	private getDirectorFilter(directors: string[]): Prisma.MediaWhereInput {
		return {
			directors: {
				some: {
					slug: {
						in: directors.map((director) => director),
					},
				},
			},
		}
	}

	private getProducerFilter(producers: string[]): Prisma.MediaWhereInput {
		return {
			producers: {
				some: {
					slug: {
						in: producers.map((producer) => producer),
					},
				},
			},
		}
	}

	private getScenaristFilter(scenarists: string[]): Prisma.MediaWhereInput {
		return {
			scenarists: {
				some: {
					slug: {
						in: scenarists.map((scenarist) => scenarist),
					},
				},
			},
		}
	}

	private getOperatorFilter(operators: string[]): Prisma.MediaWhereInput {
		return {
			operators: {
				some: {
					slug: {
						in: operators.map((operator) => operator),
					},
				},
			},
		}
	}

	private getYearFilter(years: string[]): Prisma.MediaWhereInput {
		return {
			year: {
				in: years.map((year) => +year),
			},
		}
	}

	private getAgeFilter(ages: string[]): Prisma.MediaWhereInput {
		return {
			age: {
				in: ages.map((age) => +age),
			},
		}
	}

	private getCountryFilter(countries: string[]): Prisma.MediaWhereInput {
		return {
			countries: {
				hasSome: countries,
			},
		}
	}

	private getVisibleFilter(visibility: boolean): Prisma.MediaWhereInput {
		return {
			isVisible: visibility,
		}
	}

	private getSortOption(
		sort: EnumSort
	): Prisma.MediaOrderByWithRelationInput[] {
		switch (sort) {
			case EnumSort.NEWEST:
				return [{ createdAt: 'desc' }]
			case EnumSort.OLDEST:
				return [{ createdAt: 'asc' }]
			default:
				return [{ createdAt: 'desc' }]
		}
	}

	// Admin Place

	async byId(id: number) {
		return this.prisma.media.findUnique({
			where: {
				id,
			},
			select: {
				...mediaObject,
			},
		})
	}

	async toggleVisibility(id: number) {
		const media = await this.byId(id)

		const isExists = media.isVisible

		return this.prisma.media.update({
			where: {
				id,
			},
			data: {
				isVisible: isExists ? false : true,
			},
		})
	}

	async createMediaMovie() {
		const movieId = await this.movieService.create()

		const media = await this.prisma.media.create({
			data: {
				name: '',
				slug: '',
				excerpt: '',
				description: '',
				poster: '',
				bigPoster: '',
				movie: {
					connect: {
						id: movieId,
					},
				},
				countries: [],
				isMovie: true,
			},
		})

		return media.id
	}

	async createMediaSeries() {
		const media = await this.prisma.media.create({
			data: {
				name: '',
				slug: '',
				excerpt: '',
				description: '',
				poster: '',
				bigPoster: '',
				year: undefined,
				age: undefined,
				countries: [],
				isSeries: true,
			},
		})

		return media.id
	}

	async updateMediaMovie(id: number, dto: UpdateMediaMovieDto) {
		return this.prisma.media.update({
			where: {
				id,
			},
			data: {
				name: dto.name,
				slug: generateSlug(dto.name),
				excerpt: dto.excerpt,
				description: dto.description,
				poster: dto.poster,
				bigPoster: dto.bigPoster,
				movie: {
					update: {
						trailers: {
							deleteMany: {},
							create: dto.movie.trailers.map((trailer) => ({
								language: trailer.language,
								items: {
									createMany: {
										data: trailer.items.map((item) => ({
											quality: item.quality,
											url: item.url,
										})),
									},
								},
							})),
						},
						videos: {
							deleteMany: {},
							create: dto.movie.videos.map((video) => ({
								language: video.language,
								items: {
									createMany: {
										data: video.items.map((item) => ({
											quality: item.quality,
											url: item.url,
										})),
									},
								},
							})),
						},
						duration: dto.movie.duration,
						releaseDate: dto.movie.releaseDate,
					},
				},
				groups: {
					connect: dto.groups.map((groupId) => ({ id: groupId })),
				},
				genres: {
					connect: dto.genres.map((genreId) => ({ id: genreId })),
				},
				actors: {
					connect: dto.actors.map((actorId) => ({ id: actorId })),
				},
				directors: {
					connect: dto.directors.map((directorId) => ({ id: directorId })),
				},
				producers: {
					connect: dto.producers.map((producerId) => ({ id: producerId })),
				},
				scenarists: {
					connect: dto.scenarists.map((scenaristId) => ({ id: scenaristId })),
				},
				operators: {
					connect: dto.operators.map((operatorId) => ({ id: operatorId })),
				},
				year: dto.year,
				age: dto.age,
				countries: dto.countries,
				isVisible: true,
			},
		})
	}

	async updateMediaSeries(id: number, dto: UpdateMediaSeasonsDto) {
		return this.prisma.media.update({
			where: {
				id,
			},
			data: {
				name: dto.name,
				slug: generateSlug(dto.name),
				excerpt: dto.excerpt,
				description: dto.description,
				poster: dto.poster,
				bigPoster: dto.bigPoster,
				seasons: {
					deleteMany: {},
					create: dto.seasons.map((season) => ({
						number: season.number,
						episodes: {
							create: season.episodes.map((episode) => ({
								number: episode.number,
								excerpt: episode.excerpt,
								description: episode.description,
								poster: episode.poster,
								bigPoster: episode.bigPoster,
								duration: episode.duration,
								releaseDate: episode.releaseDate,
								trailers: {
									create: episode.trailers.map((trailer) => ({
										language: trailer.language,
										items: {
											createMany: {
												data: trailer.items.map((item) => ({
													quality: item.quality,
													url: item.url,
												})),
											},
										},
									})),
								},
								videos: {
									create: episode.videos.map((video) => ({
										language: video.language,
										items: {
											createMany: {
												data: video.items.map((item) => ({
													quality: item.quality,
													url: item.url,
												})),
											},
										},
									})),
								},
							})),
						},
					})),
				},
				groups: {
					connect: dto.groups.map((groupId) => ({ id: groupId })),
				},
				genres: {
					connect: dto.genres.map((genreId) => ({ id: genreId })),
				},
				actors: {
					connect: dto.actors.map((actorId) => ({ id: actorId })),
				},
				directors: {
					connect: dto.directors.map((directorId) => ({ id: directorId })),
				},
				producers: {
					connect: dto.producers.map((producerId) => ({ id: producerId })),
				},
				scenarists: {
					connect: dto.scenarists.map((scenaristId) => ({ id: scenaristId })),
				},
				operators: {
					connect: dto.operators.map((operatorId) => ({ id: operatorId })),
				},
				year: dto.year,
				age: dto.age,
				countries: dto.countries,
				isSeries: true,
				isVisible: true,
			},
		})
	}

	async delete(id: number) {
		return this.prisma.media.delete({
			where: {
				id,
			},
		})
	}
}
