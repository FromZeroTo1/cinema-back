import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { UpdateEpisodeDto } from './dto/update-episode.dto'
import { episodeDtoObject } from './object/episode-dto.object'
import { episodeObject } from './object/episode.object'

@Injectable()
export class EpisodeService {
	constructor(private prisma: PrismaService) {}

	async getAll(seasonId: number) {
		const episodes = await this.prisma.episode.findMany({
			where: {
				seasonId,
			},
			select: episodeObject,
		})

		return {
			episodes,
			length: await this.prisma.episode.count({
				where: { seasonId },
			}),
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
