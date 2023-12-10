import { Prisma } from '@prisma/client'
import { mediaObject } from 'src/media/object/media.object'

export const groupObject: Prisma.GroupSelect = {
	id: true,
	name: true,
	slug: true,
	description: true,
	icon: true,
	isVisible: true,
	createdAt: true,
}

export const groupFullestObject: Prisma.GroupSelect = {
	...groupObject,
	media: { select: mediaObject },
}
