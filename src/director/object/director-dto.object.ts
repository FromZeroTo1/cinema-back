import { Prisma } from '@prisma/client'

export const directorDtoObject: Prisma.DirectorSelect = {
	name: true,
	photo: true,
	isVisible: true,
}
