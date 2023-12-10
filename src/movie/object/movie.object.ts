import { Prisma } from '@prisma/client'
import { sourceObject } from 'src/source/object/source.object'

export const movieObject: Prisma.MovieSelect = {
	id: true,
	trailers: { select: sourceObject },
	videos: { select: sourceObject },
	duration: true,
	releaseDate: true,
	createdAt: true,
}
