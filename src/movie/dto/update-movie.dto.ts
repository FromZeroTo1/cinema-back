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

export class UpdateMovieDto {
	@IsNumber()
	duration: number

	@IsOptional()
	@IsString()
	releaseDate?: string

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
}
