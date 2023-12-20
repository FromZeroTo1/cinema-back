import { Prisma } from '@prisma/client'

export const seasonDtoObject: Prisma.SeasonSelect = {
	number: true,
	isVisible: true,
}
