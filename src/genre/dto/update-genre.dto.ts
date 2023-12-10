import { IsOptional, IsString } from 'class-validator'

export class UpdateGenreDto {
	@IsString()
	name: string

	@IsString()
	@IsOptional()
	description?: string

	@IsString()
	@IsOptional()
	icon?: string
}
