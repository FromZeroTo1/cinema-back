import { Prisma } from '@prisma/client'
import { mediaObject } from 'src/media/object/media.object'

export const actorObject: Prisma.ActorSelect = {
	id: true,
	name: true,
	slug: true,
	photo: true,
	isVisible: true,
	createdAt: true,
}

export const actorFullestObject: Prisma.ActorSelect = {
	...actorObject,
	media: { select: mediaObject },
}
