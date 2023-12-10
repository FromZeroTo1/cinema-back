import { EnumSubscribeStatus } from '@prisma/client'
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'

export class BuySubscribeDto {
	@IsOptional()
	@IsEnum(EnumSubscribeStatus)
	status: EnumSubscribeStatus

	@IsString()
	@IsOptional()
	promocode?: string

	@IsNumber()
	tariffId: number
}
