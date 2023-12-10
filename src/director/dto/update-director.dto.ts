import { IsOptional, IsString } from 'class-validator'

export class UpdateDirectorDto {
	@IsString()
	name: string

	@IsString()
	@IsOptional()
	photo?: string
}
