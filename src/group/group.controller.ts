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
import { UpdateGroupDto } from './dto/update-group.dto'
import { GroupService } from './group.service'

@Controller('groups')
export class GroupController {
	constructor(private readonly groupService: GroupService) {}

	@UsePipes(new ValidationPipe())
	@Get()
	async getAll(@Query() queryDto: QueryDto) {
		return this.groupService.getAll(queryDto)
	}

	@Get('collections')
	async getCollections() {
		return this.groupService.getCollections()
	}

	@Get('by-slug/:slug')
	async bySlug(@Param('slug') slug: string) {
		return this.groupService.bySlug(slug)
	}

	// Admin Place

	@Get(':id')
	@Auth('admin')
	async get(@Param('id') id: string) {
		return this.groupService.byId(+id)
	}

	@Put('toggle-visibility/:id')
	@HttpCode(200)
	@Auth('admin')
	async toggleVisibility(@Param('id') id: string) {
		return this.groupService.toggleVisibility(+id)
	}

	@Post()
	@HttpCode(200)
	@Auth('admin')
	async create() {
		return this.groupService.create()
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth('admin')
	async update(@Param('id') id: string, @Body() dto: UpdateGroupDto) {
		return this.groupService.update(+id, dto)
	}

	@Delete(':id')
	@HttpCode(200)
	@Auth('admin')
	async delete(@Param('id') id: string) {
		return this.groupService.delete(+id)
	}
}
