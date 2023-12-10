import { Prisma } from '@prisma/client'
import { mediaObject } from 'src/media/object/media.object'

export const directorObject: Prisma.DirectorSelect = {
	id: true,
	name: true,
	slug: true,
	photo: true,
	isVisible: true,
	createdAt: true,
}

export const directorFullestObject: Prisma.DirectorSelect = {
	...directorObject,
	media: { select: mediaObject },
}
