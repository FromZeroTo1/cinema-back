import { Prisma } from '@prisma/client'
import { mediaObject } from 'src/media/object/media.object'

export const producerObject: Prisma.ProducerSelect = {
	id: true,
	name: true,
	slug: true,
	photo: true,
	isVisible: true,
	createdAt: true,
}

export const producerFullestObject: Prisma.ProducerSelect = {
	...producerObject,
	media: { select: mediaObject },
}
