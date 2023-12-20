import { Prisma } from '@prisma/client'
import { sourceObject } from 'src/source/object/source.object'

export const episodeDtoObject: Prisma.EpisodeSelect = {
	number: true,
	excerpt: true,
	description: true,
	poster: true,
	bigPoster: true,
	duration: true,
	trailers: { select: sourceObject },
	videos: { select: sourceObject },
	isVisible: true,
	releaseDate: true,
}
