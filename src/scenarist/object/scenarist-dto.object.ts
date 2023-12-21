import { Prisma } from '@prisma/client'

export const scenaristDtoObject: Prisma.ScenaristSelect = {
	name: true,
	photo: true,
	isVisible: true,
}
