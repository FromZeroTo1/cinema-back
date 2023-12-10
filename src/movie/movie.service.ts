import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class MovieService {
	constructor(private prisma: PrismaService) {}

	async create() {
		const movie = await this.prisma.movie.create({
			data: {},
		})

		return movie.id
	}
}
