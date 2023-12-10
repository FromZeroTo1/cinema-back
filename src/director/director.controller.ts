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
import { DirectorService } from './director.service'
import { UpdateDirectorDto } from './dto/update-director.dto'

@Controller('directors')
export class DirectorController {
	constructor(private readonly directorService: DirectorService) {}

	@UsePipes(new ValidationPipe())
	@Get()
	async getAll(@Query() queryDto: QueryDto) {
		return this.directorService.getAll(queryDto)
	}

	@Get('by-slug/:slug')
	async bySlug(@Param('slug') slug: string) {
		return this.directorService.bySlug(slug)
	}

	// Admin Place

	@Get(':id')
	@Auth('admin')
	async get(@Param('id') id: string) {
		return this.directorService.byId(+id)
	}

	@Put('toggle-visibility/:id')
	@HttpCode(200)
	@Auth('admin')
	async toggleVisibility(@Param('id') id: string) {
		return this.directorService.toggleVisibility(+id)
	}

	@Post()
	@HttpCode(200)
	@Auth('admin')
	async create() {
		return this.directorService.create()
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth('admin')
	async update(@Param('id') id: string, @Body() dto: UpdateDirectorDto) {
		return this.directorService.update(+id, dto)
	}

	@Delete(':id')
	@HttpCode(200)
	@Auth('admin')
	async delete(@Param('id') id: string) {
		return this.directorService.delete(+id)
	}
}
