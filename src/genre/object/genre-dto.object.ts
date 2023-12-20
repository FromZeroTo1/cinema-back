import { Prisma } from '@prisma/client'

export const genreDtoObject: Prisma.GenreSelect = {
	name: true,
	description: true,
	icon: true,
}
