import { IsBoolean, IsOptional, IsString } from 'class-validator'

export class UpdateScenaristDto {
	@IsString()
	name: string

	@IsString()
	@IsOptional()
	photo?: string
}
