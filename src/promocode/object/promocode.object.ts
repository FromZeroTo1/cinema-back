import { Prisma } from '@prisma/client'

export const promocodeObject: Prisma.PromocodeSelect = {
	id: true,
	sale: true,
	code: true,
	description: true,
	expiresAt: true,
	isVisible: true,
	createdAt: true,
}
