import { Prisma } from '@prisma/client'

export const cardDtoObject: Prisma.CardSelect = {
	number: true,
	owner: true,
	month: true,
	year: true,
	cvv: true,
	isMain: true,
}