import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'

export class UpdateCardDto {
	@IsOptional()
	@IsString()
	number: string

	@IsOptional()
	@IsString()
	owner: string

	@IsOptional()
	@IsNumber()
	month: number

	@IsOptional()
	@IsNumber()
	year: number

	@IsOptional()
	@IsNumber()
	cvv: number

	@IsOptional()
	@IsBoolean()
	isMain?: boolean
}
