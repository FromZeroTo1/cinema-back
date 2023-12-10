import { IsNumber, IsOptional, IsString } from 'class-validator'

export class UpdateActorDto {
	@IsString()
	name: string

	@IsString()
	@IsOptional()
	photo?: string
}
