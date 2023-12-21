import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { MediaService } from 'src/media/media.service'
import { PaginationService } from 'src/pagination/pagination.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { EnumSort, QueryDto } from 'src/query-dto/query.dto'
import { generateSlug } from 'src/utils/generate-slug'
import { UpdateGroupDto } from './dto/update-group.dto'
import { groupDtoObject } from './object/group-dto.object'
import { groupFullestObject, groupObject } from './object/group.object'

@Injectable()
export class GroupService {
	constructor(
		private prisma: PrismaService,
		private paginationService: PaginationService,
		private mediaService: MediaService
	) {}

	async getAll(dto: QueryDto = {}) {
		const { perPage, skip } = this.paginationService.getPagination(dto)

		const filters = this.createFilter(dto)

		const affiliations = await this.prisma.group.findMany({
			where: filters,
			orderBy: this.getSortOption(dto.sort),
			skip,
			take: perPage,
			select: groupObject,
		})

		return {
			affiliations,
			length: await this.prisma.group.count({
				where: filters,
			}),
		}
	}

	async getCollections() {
		const { affiliations } = await this.getAll()
		const collections = await Promise.all(
			affiliations.map(async (group) => {
				const mediaByGroup = await this.mediaService.getAll({
					group: group.slug,
				})

				if (mediaByGroup.length > 0) {
					const result = {
						id: group.id,
						name: group.name,
						slug: group.slug,
						image: mediaByGroup[0].bigPoster,
						mediaCount: mediaByGroup.length,
					}

					return result
				} else {
					return null
				}
			})
		)

		const filteredCollections = collections.filter(
			(collection) => collection !== null
		)

		return filteredCollections
	}

	async bySlug(slug: string) {
		const group = await this.prisma.group.findUnique({
			where: {
				slug,
				isVisible: true,
			},
			select: groupFullestObject,
		})

		if (!group) throw new NotFoundException('Group not found')

		return group
	}

	private getSortOption(
		sort: EnumSort
	): Prisma.GroupOrderByWithRelationInput[] {
		switch (sort) {
			case EnumSort.NEWEST:
				return [{ createdAt: 'desc' }]
			case EnumSort.OLDEST:
				return [{ createdAt: 'asc' }]
			default:
				return [{ createdAt: 'desc' }]
		}
	}

	private createFilter(dto: QueryDto): Prisma.GroupWhereInput {
		const filters: Prisma.GroupWhereInput[] = []

		if (dto.searchTerm) filters.push(this.getSearchTermFilter(dto.searchTerm))

		if (dto.media) filters.push(this.getMediaFilter(dto.media.split('|')))
		if (dto.isVisible) filters.push(this.getVisibleFilter(dto.isVisible))
		
		return filters.length ? { AND: filters } : {}
	}

	private getSearchTermFilter(searchTerm: string): Prisma.GroupWhereInput {
		return {
			OR: [
				{
					name: {
						contains: searchTerm,
						mode: 'insensitive',
					},
				},
				{
					description: {
						contains: searchTerm,
						mode: 'insensitive',
					},
				},
			],
		}
	}

	private getVisibleFilter(isVisible: string): Prisma.GroupWhereInput {
		return {
			isVisible: !!isVisible,
		}
	}

	private getMediaFilter(media: string[]): Prisma.GroupWhereInput {
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

	// Admin Place

	async byId(id: number) {
		const group = await this.prisma.group.findUnique({
			where: {
				id,
			},
			select: groupDtoObject,
		})

		if (!group) throw new NotFoundException('Group not found')

		return group
	}

	async toggleVisibility(id: number) {
		const group = await this.byId(id)

		const isExists = group.isVisible

		return this.prisma.group.update({
			where: {
				id,
			},
			data: {
				isVisible: isExists ? false : true,
			},
		})
	}

	async create() {
		const group = await this.prisma.group.create({
			data: {
				name: '',
				slug: '',
			},
		})

		return group.id
	}

	async update(id: number, dto: UpdateGroupDto) {
		return this.prisma.group.update({
			where: {
				id,
			},
			data: {
				name: dto.name,
				slug: generateSlug(dto.name),
				description: dto.description,
				icon: dto.icon,
				isVisible: true,
			},
		})
	}

	async delete(id: number) {
		return this.prisma.group.delete({
			where: {
				id,
			},
		})
	}
}
