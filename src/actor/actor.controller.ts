import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { Auth } from 'src/auth/jwt/decorators/auth.decorator'
import { QueryDto } from 'src/query-dto/query.dto'
import { ActorService } from './actor.service'
import { UpdateActorDto } from './dto/update-actor.dto'

@Controller('actors')
export class ActorController {
	constructor(private readonly actorService: ActorService) {}

	@UsePipes(new ValidationPipe())
	@Get()
	async getAll(@Query() queryDto: QueryDto) {
		return this.actorService.getAll(queryDto)
	}

	@Get('by-slug/:slug')
	async bySlug(@Param('slug') slug: string) {
		return this.actorService.bySlug(slug)
	}

	// Admin Place

	@Get(':id')
	@Auth('admin')
	async get(@Param('id') id: string) {
		return this.actorService.byId(+id)
	}

	@Put('toggle-visibility/:id')
	@HttpCode(200)
	@Auth('admin')
	async toggleVisibility(@Param('id') id: string) {
		return this.actorService.toggleVisibility(+id)
	}

	@Post()
	@HttpCode(200)
	@Auth('admin')
	async create() {
		return this.actorService.create()
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth('admin')
	async update(@Param('id') id: string, @Body() dto: UpdateActorDto) {
		return this.actorService.update(+id, dto)
	}

	@Delete(':id')
	@HttpCode(200)
	@Auth('admin')
	async delete(@Param('id') id: string) {
		return this.actorService.delete(+id)
	}
}
