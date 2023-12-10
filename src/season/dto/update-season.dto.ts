import { Type } from 'class-transformer'
import {
	ArrayNotEmpty,
	IsArray,
	IsNumber,
	ValidateNested,
} from 'class-validator'
import { UpdateEpisodeDto } from 'src/episode/dto/update-episode.dto'

export class UpdateSeasonDto {
	@IsNumber()
	number: number

	@ArrayNotEmpty()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => UpdateEpisodeDto)
	episodes: UpdateEpisodeDto[]
}
