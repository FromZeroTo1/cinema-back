import { Prisma } from '@prisma/client'
import { mediaObject } from 'src/media/object/media.object'

export const genreObject: Prisma.GenreSelect = {
	id: true,
	name: true,
	slug: true,
	description: true,
	icon: true,
	isVisible: true,
	createdAt: true,
}

export const genreFullestObject: Prisma.GenreSelect = {
	...genreObject,
	media: { select: mediaObject },
}
