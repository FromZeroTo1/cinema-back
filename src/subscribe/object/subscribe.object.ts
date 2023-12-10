import { Prisma } from '@prisma/client'
import { tariffObject } from 'src/tariff/object/tariff.object'

export const subscribeObject: Prisma.SubscribeSelect = {
	id: true,
	status: true,
	tariff: { select: tariffObject },
	createdAt: true,
}
