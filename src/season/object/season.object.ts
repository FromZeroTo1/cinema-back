import { Prisma } from '@prisma/client'
import { episodeObject } from 'src/episode/object/episode.object'

export const seasonObject: Prisma.SeasonSelect = {
	id: true,
	number: true,
	episodes: { select: episodeObject },
	isVisible: true,
	createdAt: true,
}
