import {
	Body,
	Controller,
	HttpCode,
	Put,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { MediaSeriesViewsDto } from 'src/media/dto/media-views.dto'
import { EpisodeService } from './episode.service'

@Controller('episodes')
export class EpisodeController {
	constructor(private readonly episodeService: EpisodeService) {}

	@UsePipes(new ValidationPipe())
	@Put('update-views')
	@HttpCode(200)
	async updateViews(@Body() dto: MediaSeriesViewsDto) {
		return this.episodeService.updateViews(dto)
	}
}
