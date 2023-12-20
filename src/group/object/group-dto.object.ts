import { Prisma } from '@prisma/client'

export const groupDtoObject: Prisma.GroupSelect = {
	name: true,
	description: true,
	icon: true,
}
