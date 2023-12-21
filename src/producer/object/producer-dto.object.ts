import { Prisma } from '@prisma/client'

export const producerDtoObject: Prisma.ProducerSelect = {
	name: true,
	photo: true,
	isVisible: true,
}
