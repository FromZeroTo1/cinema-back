import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PaginationService } from 'src/pagination/pagination.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { EnumSort, QueryDto } from 'src/query-dto/query.dto'
import { generateSlug } from 'src/utils/generate-slug'
import { UpdateActorDto } from './dto/update-actor.dto'
import { actorFullestObject, actorObject } from './object/actor.object'

@Injectable()
export class ActorService {
	constructor(
		private prisma: PrismaService,
		private paginationService: PaginationService
	) {}

	async getAll(dto: QueryDto = {}) {
		const { perPage, skip } = this.paginationService.getPagination(dto)

		const filters = this.createFilter(dto)

		const actors = await this.prisma.actor.findMany({
			where: filters,
			orderBy: this.getSortOption(dto.sort),
			skip,
			take: perPage,
			select: actorObject,
		})

		return {
			actors,
			length: await this.prisma.actor.count({
				where: filters,
			}),
		}
	}

	async bySlug(slug: string) {
		const actor = await this.prisma.actor.findUnique({
			where: {
				slug,
				isVisible: true,
			},
			select: actorFullestObject,
		})

		if (!actor) throw new NotFoundException('Actor not found')

		return actor
	}

	private getSortOption(
		sort: EnumSort
	): Prisma.ActorOrderByWithRelationInput[] {
		switch (sort) {
			case EnumSort.NEWEST:
				return [{ createdAt: 'desc' }]
			case EnumSort.OLDEST:
				return [{ createdAt: 'asc' }]
			default:
				return [{ createdAt: 'desc' }]
		}
	}

	private createFilter(dto: QueryDto): Prisma.ActorWhereInput {
		const filters: Prisma.ActorWhereInput[] = []

		if (dto.searchTerm) filters.push(this.getSearchTermFilter(dto.searchTerm))

		if (dto.media) filters.push(this.getMediaFilter(dto.media.split('|')))
		if (dto.visible) filters.push(this.getVisibleFilter(dto.visible || true))

		return filters.length ? { AND: filters } : {}
	}

	private getSearchTermFilter(searchTerm: string): Prisma.ActorWhereInput {
		return {
			name: {
				contains: searchTerm,
				mode: 'insensitive',
			},
		}
	}

	private getMediaFilter(media: string[]): Prisma.ActorWhereInput {
		return {
			media: {
				some: {
					slug: {
						in: media,
					},
				},
			},
		}
	}

	private getVisibleFilter(visibility: boolean): Prisma.ActorWhereInput {
		return {
			isVisible: visibility,
		}
	}

	// Admin Place

	async byId(id: number) {
		const actor = await this.prisma.actor.findUnique({
			where: {
				id,
			},
			select: actorObject,
		})

		if (!actor) throw new NotFoundException('Actor not found')

		return actor
	}

	async create() {
		const actor = await this.prisma.actor.create({
			data: {
				name: '',
				slug: '',
			},
		})

		return actor.id
	}

	async update(id: number, dto: UpdateActorDto) {
		return this.prisma.actor.update({
			where: {
				id,
			},
			data: {
				name: dto.name,
				slug: generateSlug(dto.name),
				photo: dto.photo,
				isVisible: true,
			},
		})
	}

	async toggleVisibility(id: number) {
		const actor = await this.byId(id)

		const isExists = actor.isVisible

		return this.prisma.actor.update({
			where: {
				id,
			},
			data: {
				isVisible: isExists ? false : true,
			},
		})
	}

	async delete(id: number) {
		return this.prisma.actor.delete({
			where: {
				id,
			},
		})
	}
}
