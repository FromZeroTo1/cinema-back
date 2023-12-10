import { IsNumber, IsString, IsOptional, IsBoolean } from 'class-validator'

export class UpdatePromocodeDto {
	@IsNumber()
	sale: number

	@IsString()
	code: string

	@IsOptional()
	@IsString()
	description?: string

	@IsOptional()
	@IsString()
	expiresAt?: string
}
