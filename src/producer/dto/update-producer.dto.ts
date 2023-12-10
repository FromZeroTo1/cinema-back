import { IsBoolean, IsOptional, IsString } from 'class-validator'

export class UpdateProducerDto {
	@IsString()
	name: string

	@IsString()
	@IsOptional()
	photo?: string
}
