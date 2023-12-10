import { IsNumber } from 'class-validator'

export class MediaIdDto {
	@IsNumber()
	mediaId: number
}
