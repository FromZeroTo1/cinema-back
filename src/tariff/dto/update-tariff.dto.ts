import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'

export class UpdateTariffDto {
	@IsString()
	name: string

	@IsNumber()
	duration: number

	@IsNumber()
	price: number

	@IsOptional()
	@IsNumber()
	salePrice?: number

	@IsString()
	description: string
}
