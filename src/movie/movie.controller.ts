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
import { UpdateMovieDto } from './dto/update-movie.dto'
import { MovieService } from './movie.service'

@Controller('movies')
export class MovieController {
	constructor(private readonly movieService: MovieService) {}

	// Admin Place

	@Post()
	@HttpCode(200)
	@Auth('admin')
	async create() {
		return this.movieService.create()
	}
}
