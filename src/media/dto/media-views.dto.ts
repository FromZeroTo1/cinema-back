import { IsNumber, IsString } from 'class-validator'

export class MediaMovieViewsDto {
	@IsString()
	mediaSlug: string
}

export class MediaSeriesViewsDto {
	@IsString()
	mediaSlug: string

	@IsNumber()
	episodeId: number
}
