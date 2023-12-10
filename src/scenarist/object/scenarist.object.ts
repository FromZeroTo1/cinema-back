import { Prisma } from '@prisma/client'
import { mediaObject } from 'src/media/object/media.object'

export const scenaristObject: Prisma.ScenaristSelect = {
	id: true,
	name: true,
	slug: true,
	photo: true,
	isVisible: true,
	createdAt: true,
}

export const scenaristFullestObject: Prisma.ScenaristSelect = {
	...scenaristObject,
	media: { select: mediaObject },
}
