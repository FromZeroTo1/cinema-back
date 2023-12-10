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
import { UpdateOperatorDto } from './dto/update-operator.dto'
import { OperatorService } from './operator.service'

@Controller('operators')
export class OperatorController {
	constructor(private readonly operatorService: OperatorService) {}

	@UsePipes(new ValidationPipe())
	@Get()
	async getAll(@Query() queryDto: QueryDto) {
		return this.operatorService.getAll(queryDto)
	}

	@Get('by-slug/:slug')
	async bySlug(@Param('slug') slug: string) {
		return this.operatorService.bySlug(slug)
	}

	// Admin Place

	@Get(':id')
	@Auth('admin')
	async get(@Param('id') id: string) {
		return this.operatorService.byId(+id)
	}

	@Put('toggle-visibility/:id')
	@HttpCode(200)
	@Auth('admin')
	async toggleVisibility(@Param('id') id: string) {
		return this.operatorService.toggleVisibility(+id)
	}

	@Post()
	@HttpCode(200)
	@Auth('admin')
	async create() {
		return this.operatorService.create()
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth('admin')
	async update(@Param('id') id: string, @Body() dto: UpdateOperatorDto) {
		return this.operatorService.update(+id, dto)
	}

	@Delete(':id')
	@HttpCode(200)
	@Auth('admin')
	async delete(@Param('id') id: string) {
		return this.operatorService.delete(+id)
	}
}
