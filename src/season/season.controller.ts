import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { Auth } from 'src/auth/jwt/decorators/auth.decorator'
import { UpdateSeasonDto } from './dto/update-season.dto'
import { SeasonService } from './season.service'

@Controller('seasons')
export class SeasonController {
	constructor(private readonly seasonService: SeasonService) {}

	// Admin Place

	@Get('media/:id')
	@Auth('admin')
	async getAll(@Param('id') id: string) {
		return this.seasonService.getAll(+id)
	}

	@Put('toggle-visibility/:id')
	@HttpCode(200)
	@Auth('admin')
	async toggleVisibility(@Param('id') id: string) {
		return this.seasonService.toggleVisibility(+id)
	}

	@Get(':id')
	@Auth('admin')
	async get(@Param('id') id: string) {
		return this.seasonService.byId(+id)
	}

	@Post(':id')
	@HttpCode(200)
	@Auth('admin')
	async create(@Param('id') id: string) {
		return this.seasonService.create(+id)
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth('admin')
	async update(@Param('id') id: string, @Body() dto: UpdateSeasonDto) {
		return this.seasonService.update(+id, dto)
	}

	@Delete(':id')
	@HttpCode(200)
	@Auth('admin')
	async delete(@Param('id') id: string) {
		return this.seasonService.delete(+id)
	}
}
