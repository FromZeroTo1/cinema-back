import { Prisma } from '@prisma/client'
import { sourceObject } from 'src/source/object/source.object'

export const episodeObject: Prisma.EpisodeSelect = {
	id: true,
	number: true,
	excerpt: true,
	description: true,
	poster: true,
	bigPoster: true,
	duration: true,
	trailers: { select: sourceObject },
	videos: { select: sourceObject },
	rating: true,
	views: true,
	likes: true,
	releaseDate: true,
	createdAt: true,
}
