import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { hash } from 'argon2'
import { PaginationService } from 'src/pagination/pagination.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { EnumSort } from 'src/query-dto/query.dto'
import { UserQueryDto } from './dto/query-user.dto'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { userObject } from './object/user.object'

@Injectable()
export class UserService {
	constructor(
		private prisma: PrismaService,
		private paginationService: PaginationService
	) {}

	async getAll(dto: UserQueryDto = {}) {
		const { perPage, skip } = this.paginationService.getPagination(dto)

		const filters = this.createFilter(dto)

		const users = await this.prisma.user.findMany({
			where: filters,
			orderBy: this.getSortOption(dto.sort),
			skip,
			take: perPage,
			select: userObject,
		})

		return {
			users,
			length: await this.prisma.user.count({
				where: filters,
			}),
		}
	}

	async byId(id: number, selectObject: Prisma.UserSelect = {}) {
		const user = await this.prisma.user.findUnique({
			where: {
				id,
			},
			select: {
				...userObject,
				...selectObject,
			},
		})

		if (!user) throw new NotFoundException('User not found')

		return user
	}

	async updateProfile(id: number, dto: UpdateProfileDto) {
		const isSameEmail = await this.prisma.user.findUnique({
			where: {
				email: dto.email,
			},
		})

		const isSameLogin = await this.prisma.user.findUnique({
			where: {
				login: dto.login,
			},
		})

		if (isSameEmail && id !== isSameEmail.id) {
			throw new BadRequestException('Email already in use')
		} else if (isSameLogin && id !== isSameLogin.id) {
			throw new BadRequestException('Login already in use')
		}

		const user = await this.byId(id)

		return this.prisma.user.update({
			where: {
				id,
			},
			data: {
				login: dto.login,
				email: dto.email,
				password: dto.newPassword ? await hash(dto.newPassword) : user.password,
				avatarPath: dto.avatarPath,
				cards: {
					connect: dto.cards.map((cardId) => ({ id: cardId })),
				},
			},
		})
	}

	private getSortOption(sort: EnumSort): Prisma.UserOrderByWithRelationInput[] {
		switch (sort) {
			case EnumSort.NEWEST:
				return [{ createdAt: 'desc' }]
			case EnumSort.OLDEST:
				return [{ createdAt: 'asc' }]
			default:
				return [{ createdAt: 'desc' }]
		}
	}

	private createFilter(dto: UserQueryDto): Prisma.UserWhereInput {
		const filters: Prisma.UserWhereInput[] = []

		if (dto.searchTerm) filters.push(this.getSearchTermFilter(dto.searchTerm))
		if (dto.isVisible) {
			filters.push(this.getVisibleFilter(dto.isVisible))
		} else {
			filters.push(this.getVisibleFilter('true'))
		}

		return filters.length ? { AND: filters } : {}
	}

	private getVisibleFilter(isVisible: string): Prisma.UserWhereInput {
		return {
			isVisible: !!isVisible,
		}
	}

	private getSearchTermFilter(searchTerm: string): Prisma.UserWhereInput {
		return {
			OR: [
				{
					login: {
						contains: searchTerm,
						mode: 'insensitive',
					},
				},
				{
					email: {
						contains: searchTerm,
						mode: 'insensitive',
					},
				},
			],
		}
	}

	// Admin Place

	async toggleVisibility(id: number) {
		const user = await this.byId(id)

		const isExists = user.isVisible

		return this.prisma.user.update({
			where: {
				id,
			},
			data: {
				isVisible: isExists ? false : true,
			},
		})
	}

	async create() {
		const user = await this.prisma.user.create({
			data: {
				login: '',
				email: '',
				password: '',
				avatarPath: '',
				isVisible: false,
			},
		})

		return user.id
	}

	async update(id: number, dto: UpdateUserDto) {
		const user = await this.byId(id)

		const userData: Prisma.UserUpdateInput = {
			login: dto.login,
			email: dto.email,
			password: dto.newPassword ? await hash(dto.newPassword) : user.password,
			avatarPath: dto.avatarPath,
			isSubscribed: dto.isSubscribed,
			isAdmin: dto.isAdmin,
			isVisible: true,
		}

		userData.promocodes = this.createConnectObject(dto.promocodes)

		return this.prisma.user.update({
			where: {
				id,
			},
			data: userData,
		})
	}

	async delete(id: number) {
		return this.prisma.user.delete({
			where: {
				id,
			},
		})
	}

	private createConnectObject = (ids: number[] | undefined) =>
		ids && ids.length > 0 ? { connect: ids.map((id) => ({ id })) } : undefined
}
