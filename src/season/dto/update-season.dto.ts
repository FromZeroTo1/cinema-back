import { IsNumber } from 'class-validator'

export class UpdateSeasonDto {
	@IsNumber()
	number: number
}
