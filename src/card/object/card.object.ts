import { Prisma } from '@prisma/client'

export const cardObject: Prisma.CardSelect = {
	id: true,
	number: true,
	owner: true,
	month: true,
	year: true,
	cvv: true,
	isMain: true,
	createdAt: true,
}
