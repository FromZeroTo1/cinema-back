import { Prisma } from '@prisma/client'

export const actorDtoObject: Prisma.ActorSelect = {
	name: true,
	photo: true,
	isVisible: true,
}
