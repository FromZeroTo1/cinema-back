import { Type } from 'class-transformer'
import {
	ArrayNotEmpty,
	IsArray,
	IsNumber,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator'
import { UpdateSourceDto } from 'src/source/dto/update-source.dto'

export class UpdateEpisodeDto {
	@IsNumber()
	number: number

	@IsString()
	excerpt: string

	@IsString()
	description: string

	@IsString()
	poster: string

	@IsString()
	bigPoster: string

	@IsNumber()
	duration: number

	@ArrayNotEmpty()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => UpdateSourceDto)
	trailers: UpdateSourceDto[]

	@ArrayNotEmpty()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => UpdateSourceDto)
	videos: UpdateSourceDto[]

	@IsOptional()
	@IsString()
	releaseDate?: string
}
