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
import { QueryMediaDto } from './dto/query-media.dto'
import { UpdateMediaDto, UpdateMediaMovieDto } from './dto/update-media.dto'
import { MediaService } from './media.service'

@Controller('media')
export class MediaController {
	constructor(private readonly mediaService: MediaService) {}

	@UsePipes(new ValidationPipe())
	@Get()
	async getAll(@Query() queryDto: QueryMediaDto) {
		return this.mediaService.getAll(queryDto)
	}

	@Get('similar/:slug')
	async getSimilar(@Param('slug') slug: string) {
		return this.mediaService.getSimilar(slug)
	}

	@Get('by-slug/:slug')
	async bySlug(@Param('slug') slug: string) {
		return this.mediaService.bySlug(slug)
	}

	// Admin Place

	@Get('movie/:id')
	@Auth('admin')
	async getMovie(@Param('id') id: string) {
		return this.mediaService.movieById(+id)
	}

	@Get('series/:id')
	@Auth('admin')
	async getSeries(@Param('id') id: string) {
		return this.mediaService.seriesById(+id)
	}

	@Put('toggle-visibility/:id')
	@HttpCode(200)
	@Auth('admin')
	async toggleVisibility(@Param('id') id: string) {
		return this.mediaService.toggleVisibility(+id)
	}

	@Post('movie')
	@HttpCode(200)
	@Auth('admin')
	async createMovie() {
		return this.mediaService.createMovie()
	}

	@Post('series')
	@HttpCode(200)
	@Auth('admin')
	async createSeries() {
		return this.mediaService.createSeries()
	}

	@UsePipes(new ValidationPipe())
	@Put('movie/:id')
	@HttpCode(200)
	@Auth('admin')
	async updateMovie(@Param('id') id: string, @Body() dto: UpdateMediaMovieDto) {
		return this.mediaService.updateMovie(+id, dto)
	}

	@UsePipes(new ValidationPipe())
	@Put('series/:id')
	@HttpCode(200)
	@Auth('admin')
	async updateSeries(@Param('id') id: string, @Body() dto: UpdateMediaDto) {
		return this.mediaService.updateSeries(+id, dto)
	}

	@Delete(':id')
	@HttpCode(200)
	@Auth('admin')
	async delete(@Param('id') id: string) {
		return this.mediaService.delete(+id)
	}
}
