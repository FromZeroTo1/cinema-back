import { Prisma } from '@prisma/client'
import { cardObject } from 'src/card/object/card.object'

export const userProfileDtoObject: Prisma.UserSelect = {
	login: true,
	email: true,
	avatarPath: true,
	cards: { select: cardObject },
}
