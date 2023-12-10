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
import { MediaMovieViewsDto } from './dto/media-views.dto'
import { QueryMediaDto } from './dto/query-media.dto'
import {
	UpdateMediaMovieDto,
	UpdateMediaSeasonsDto,
} from './dto/update-media.dto'
import { MediaService } from './media.service'

@Controller('media')
export class MediaController {
	constructor(private readonly mediaService: MediaService) {}

	@UsePipes(new ValidationPipe())
	@Get()
	async getAll(@Query() queryDto: QueryMediaDto) {
		return this.mediaService.getAll(queryDto)
	}

	@UsePipes(new ValidationPipe())
	@Get('movies')
	async getMovies(@Query() queryDto: QueryDto) {
		return this.mediaService.getMovies(queryDto)
	}

	@UsePipes(new ValidationPipe())
	@Get('series')
	async getSeries(@Query() queryDto: QueryDto) {
		return this.mediaService.getSeries(queryDto)
	}

	@Get('similar/:slug')
	async getSimilar(@Param('slug') slug: string) {
		return this.mediaService.getSimilar(slug)
	}

	@Get('by-slug/:slug')
	async bySlug(@Param('slug') slug: string) {
		return this.mediaService.bySlug(slug)
	}

	@UsePipes(new ValidationPipe())
	@Put('movie/update-views')
	@HttpCode(200)
	async updateMediaMovieViews(@Body() dto: MediaMovieViewsDto) {
		return this.mediaService.updateMediaMovieViews(dto)
	}

	// Admin Place

	@Get(':id')
	@Auth('admin')
	async get(@Param('id') id: string) {
		return this.mediaService.byId(+id)
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
		return this.mediaService.createMediaMovie()
	}

	@Post('series')
	@HttpCode(200)
	@Auth('admin')
	async createSeries() {
		return this.mediaService.createMediaSeries()
	}

	@UsePipes(new ValidationPipe())
	@Put('movie/:id')
	@HttpCode(200)
	@Auth('admin')
	async updateMovie(@Param('id') id: string, @Body() dto: UpdateMediaMovieDto) {
		return this.mediaService.updateMediaMovie(+id, dto)
	}

	@UsePipes(new ValidationPipe())
	@Put('series/:id')
	@HttpCode(200)
	@Auth('admin')
	async updateSeries(
		@Param('id') id: string,
		@Body() dto: UpdateMediaSeasonsDto
	) {
		return this.mediaService.updateMediaSeries(+id, dto)
	}

	@Delete(':id')
	@HttpCode(200)
	@Auth('admin')
	async deleteMediaSeries(@Param('id') id: string) {
		return this.mediaService.delete(+id)
	}
}
