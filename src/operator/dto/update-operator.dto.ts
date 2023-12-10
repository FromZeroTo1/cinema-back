import { IsBoolean, IsOptional, IsString } from 'class-validator'

export class UpdateOperatorDto {
	@IsString()
	name: string

	@IsString()
	@IsOptional()
	photo?: string
}
