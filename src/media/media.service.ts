import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PaginationService } from 'src/pagination/pagination.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { generateSlug } from 'src/utils/generate-slug'
import { EnumMediaSort, QueryMediaDto } from './dto/query-media.dto'
import { UpdateMediaDto, UpdateMediaMovieDto } from './dto/update-media.dto'
import { mediaObject } from './object/media.object'
import { movieDtoObject } from './object/movie-dto.object'
import { seriesDtoObject } from './object/series-dto.object'

@Injectable()
export class MediaService {
	constructor(
		private prisma: PrismaService,
		private paginationService: PaginationService
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
		if (dto.isMovie) filters.push(this.getMoviesFilter(dto.isMovie))
		if (dto.isSeries) filters.push(this.getSeriesFilter(dto.isSeries))
		if (dto.visible) filters.push(this.getVisibleFilter(dto.visible))

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

	private getVisibleFilter(visibility: string): Prisma.MediaWhereInput {
		return {
			isVisible: !!visibility,
		}
	}

	private getMoviesFilter(isMovie: string): Prisma.MediaWhereInput {
		return {
			isMovie: !!isMovie,
		}
	}

	private getSeriesFilter(isSeries: string): Prisma.MediaWhereInput {
		return {
			isSeries: !!isSeries,
		}
	}

	// Admin Place

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

	async movieById(id: number) {
		const movie = await this.prisma.media.findUnique({
			where: {
				id,
				isMovie: true,
			},
			select: {
				...movieDtoObject,
			},
		})

		return {
			...movie,
			genres: movie.genres.map((genre) => genre.id) || [],
			groups: movie.groups.map((group) => group.id) || [],
			actors: movie.actors.map((actor) => actor.id) || [],
			directors: movie.directors.map((director) => director.id) || [],
			producers: movie.producers.map((producer) => producer.id) || [],
			scenarists: movie.scenarists.map((scenarist) => scenarist.id) || [],
			operators: movie.operators.map((operator) => operator.id) || [],
		}
	}

	async seriesById(id: number) {
		const series = await this.prisma.media.findUnique({
			where: {
				id,
				isSeries: true,
			},
			select: {
				...seriesDtoObject,
			},
		})

		console.log(series)

		return {
			...series,
			genres: series.genres ? series.genres.map((genre) => genre.id) : [],
			groups: series.groups ? series.groups.map((group) => group.id) : [],
			actors: series.actors ? series.actors.map((actor) => actor.id) : [],
			directors: series.directors
				? series.directors.map((director) => director.id)
				: [],
			producers: series.producers
				? series.producers.map((producer) => producer.id)
				: [],
			scenarists: series.scenarists
				? series.scenarists.map((scenarist) => scenarist.id)
				: [],
			operators: series.operators
				? series.operators.map((operator) => operator.id)
				: [],
		}
	}

	async createMovie() {
		const media = await this.prisma.media.create({
			data: {
				name: '',
				slug: '',
				excerpt: '',
				description: '',
				poster: '',
				bigPoster: '',
				movie: {
					create: {
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
						duration: 0,
					},
				},
				year: 0,
				age: 0,
				countries: [],
				isMovie: true,
			},
		})

		return media.id
	}

	async createSeries() {
		const media = await this.prisma.media.create({
			data: {
				name: '',
				slug: '',
				excerpt: '',
				description: '',
				poster: '',
				bigPoster: '',
				countries: [],
				year: 0,
				age: 0,
				isSeries: true,
			},
		})

		return media.id
	}

	async updateMovie(id: number, dto: UpdateMediaMovieDto) {
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
						duration: dto.movie.duration,
						releaseDate: dto.movie.releaseDate,
						trailers: {
							deleteMany: {},
							create: dto.movie.trailers.map((trailer) => ({
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
							create: dto.movie.videos.map((video) => ({
								language: video.language,
								items: {
									create: video.items.map((item) => ({
										quality: item.quality,
										url: item.url,
									})),
								},
							})),
						},
					},
				},
				groups: {
					connect: dto.groups.map((group) => ({ id: group })),
				},
				genres: {
					connect: dto.genres.map((genre) => ({ id: genre })),
				},
				actors: {
					connect: dto.actors.map((actor) => ({ id: actor })),
				},
				directors: {
					connect: dto.directors.map((director) => ({ id: director })),
				},
				producers: {
					connect: dto.producers.map((producer) => ({ id: producer })),
				},
				scenarists: {
					connect: dto.scenarists.map((scenarist) => ({ id: scenarist })),
				},
				operators: {
					connect: dto.operators.map((operator) => ({ id: operator })),
				},
				countries: dto.countries,
				year: dto.year,
				age: dto.age,
				isVisible: true,
			},
		})
	}

	async updateSeries(id: number, dto: UpdateMediaDto) {
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
				groups: {
					connect: dto.groups.map((group) => ({ id: group })),
				},
				genres: {
					connect: dto.genres.map((genre) => ({ id: genre })),
				},
				actors: {
					connect: dto.actors.map((actor) => ({ id: actor })),
				},
				directors: {
					connect: dto.directors.map((director) => ({ id: director })),
				},
				producers: {
					connect: dto.producers.map((producer) => ({ id: producer })),
				},
				scenarists: {
					connect: dto.scenarists.map((scenarist) => ({ id: scenarist })),
				},
				operators: {
					connect: dto.operators.map((operator) => ({ id: operator })),
				},
				countries: dto.countries,
				year: dto.year,
				age: dto.age,
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
