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
import { UpdateEpisodeDto } from './dto/update-episode.dto'
import { EpisodeService } from './episode.service'
import { EpisodeQueryDto } from './dto/query-episode.dto'

@Controller('episodes')
export class EpisodeController {
	constructor(private readonly episodeService: EpisodeService) {}
	// Admin Place

	@UsePipes(new ValidationPipe())
	@Auth('admin')
	@Get()
	async getAll(@Query() queryDto: EpisodeQueryDto) {
		return this.episodeService.getAll(queryDto)
	}

	@Put('toggle-visibility/:id')
	@HttpCode(200)
	@Auth('admin')
	async toggleVisibility(@Param('id') id: string) {
		return this.episodeService.toggleVisibility(+id)
	}

	@Get(':id')
	@Auth('admin')
	async get(@Param('id') id: string) {
		return this.episodeService.byId(+id)
	}

	@Post(':id')
	@HttpCode(200)
	@Auth('admin')
	async create(@Param('id') id: string) {
		return this.episodeService.create(+id)
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth('admin')
	async update(@Param('id') id: string, @Body() dto: UpdateEpisodeDto) {
		return this.episodeService.update(+id, dto)
	}

	@Delete(':id')
	@HttpCode(200)
	@Auth('admin')
	async delete(@Param('id') id: string) {
		return this.episodeService.delete(+id)
	}
}
