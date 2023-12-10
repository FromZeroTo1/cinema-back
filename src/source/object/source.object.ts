import { Prisma } from '@prisma/client'

export const sourceItemObject: Prisma.SourceItemSelect = {
	quality: true,
	url: true,
}

export const sourceObject: Prisma.SourceSelect = {
	language: true,
	items: { select: sourceItemObject },
}
