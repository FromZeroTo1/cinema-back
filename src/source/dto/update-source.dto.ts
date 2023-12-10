import { Type } from 'class-transformer'
import {
	ArrayNotEmpty,
	IsArray,
	IsString,
	ValidateNested,
} from 'class-validator'

export class UpdateSourceItemDto {
	@IsString()
	quality: string

	@IsString()
	url: string
}

export class UpdateSourceDto {
	@IsString()
	language: string

	@ArrayNotEmpty()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => UpdateSourceItemDto)
	items: UpdateSourceItemDto[]
}
