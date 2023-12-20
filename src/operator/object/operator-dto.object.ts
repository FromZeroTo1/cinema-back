import { Prisma } from '@prisma/client'

export const operatorDtoObject: Prisma.OperatorSelect = {
	name: true,
	photo: true,
}
