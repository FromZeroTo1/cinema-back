import { IsString } from 'class-validator'

export class PromocodeCodeDto {
	@IsString()
	code: string
}
