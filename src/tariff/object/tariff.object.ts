import { Prisma } from '@prisma/client'

export const tariffObject: Prisma.TariffSelect = {
	id: true,
  name: true,
  slug: true,
  duration: true,
  price: true,
  salePrice: true,
  description: true,
  isVisible: true,
	createdAt: true,
}