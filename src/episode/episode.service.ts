import { Injectable } from '@nestjs/common'
import { MediaSeriesViewsDto } from 'src/media/dto/media-views.dto'
import { MediaService } from 'src/media/media.service'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class EpisodeService {
	constructor(
		private prisma: PrismaService,
		private mediaService: MediaService
	) {}

	async updateViews({ mediaSlug, episodeId }: MediaSeriesViewsDto) {
		await this.mediaService.updateMediaSeriesViews(mediaSlug)

		return this.prisma.episode.update({
			where: {
				id: episodeId,
			},
			data: {
				views: {
					increment: 1,
				},
			},
		})
	}
}
