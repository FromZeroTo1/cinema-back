import { Type } from 'class-transformer'
import {
	ArrayNotEmpty,
	IsArray,
	IsNumber,
	IsString,
	ValidateNested,
} from 'class-validator'
import { UpdateMovieDto } from 'src/movie/dto/update-movie.dto'
import { UpdateSeasonDto } from 'src/season/dto/update-season.dto'

export class UpdateMediaDto {
	@IsString()
	name: string

	@IsString()
	excerpt: string

	@IsString()
	description: string

	@IsString()
	poster: string

	@IsString()
	bigPoster: string

	@IsNumber()
	year: number

	@IsNumber()
	age: number

	@ArrayNotEmpty()
	@IsArray()
	@IsString({ each: true })
	countries: string[]

	@ArrayNotEmpty()
	@IsArray()
	@IsNumber({}, { each: true })
	genres: number[]

	@ArrayNotEmpty()
	@IsArray()
	@IsNumber({}, { each: true })
	actors: number[]

	@ArrayNotEmpty()
	@IsArray()
	@IsNumber({}, { each: true })
	directors: number[]

	@ArrayNotEmpty()
	@IsArray()
	@IsNumber({}, { each: true })
	producers: number[]

	@ArrayNotEmpty()
	@IsArray()
	@IsNumber({}, { each: true })
	operators: number[]

	@ArrayNotEmpty()
	@IsArray()
	@IsNumber({}, { each: true })
	scenarists: number[]

	@ArrayNotEmpty()
	@IsArray()
	@IsNumber({}, { each: true })
	groups: number[]
}

export class UpdateMediaMovieDto extends UpdateMediaDto {
	@ValidateNested({ each: true })
	@Type(() => UpdateMovieDto)
	movie: UpdateMovieDto
}

export class UpdateMediaSeasonsDto extends UpdateMediaDto {
	@ArrayNotEmpty()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => UpdateSeasonDto)
	seasons: UpdateSeasonDto[]
}
