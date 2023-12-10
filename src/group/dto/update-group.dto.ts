import { IsOptional, IsString } from 'class-validator'

export class UpdateGroupDto {
	@IsString()
	name: string

	@IsString()
	@IsOptional()
	description?: string

	@IsString()
	@IsOptional()
	icon?: string
}
