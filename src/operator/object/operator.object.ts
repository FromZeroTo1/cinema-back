import { Prisma } from '@prisma/client'
import { mediaObject } from 'src/media/object/media.object'

export const operatorObject: Prisma.OperatorSelect = {
	id: true,
	name: true,
	slug: true,
	photo: true,
	isVisible: true,
	createdAt: true,
}

export const operatorFullestObject: Prisma.OperatorSelect = {
	...operatorObject,
	media: { select: mediaObject },
}
