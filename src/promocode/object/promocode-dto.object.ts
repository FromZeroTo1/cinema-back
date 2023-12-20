import { Prisma } from '@prisma/client'

export const promocodeDtoObject: Prisma.PromocodeSelect = {
	sale: true,
	code: true,
	description: true,
	expiresAt: true,
}
