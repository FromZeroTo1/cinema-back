import { Prisma } from '@prisma/client'
import { cardObject } from 'src/card/object/card.object'
import { promocodeObject } from 'src/promocode/object/promocode.object'
import { subscribeObject } from 'src/subscribe/object/subscribe.object'

export const userObject: Prisma.UserSelect = {
	id: true,
	login: true,
	email: true,
	avatarPath: true,
	isAdmin: true,
	isSubscribed: true,
	isVisible: true,
	createdAt: true,
}

export const userFullestObject: Prisma.UserSelect = {
	...userObject,
	promocodes: { select: promocodeObject },
	cards: { select: cardObject },
	subscribes: { select: subscribeObject },
}
