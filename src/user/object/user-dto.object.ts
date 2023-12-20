import { Prisma } from '@prisma/client'
import { promocodeObject } from 'src/promocode/object/promocode.object'
import { userProfileDtoObject } from './profile-dto.object'

export const userDtoObject: Prisma.UserSelect = {
	...userProfileDtoObject,
	promocodes: { select: promocodeObject },
	isAdmin: true,
	isSubscribed: true,
}
