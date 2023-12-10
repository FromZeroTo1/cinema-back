import {
	ArrayNotEmpty,
	IsArray,
	IsBoolean,
	IsNumber,
	IsOptional,
} from 'class-validator'
import { UpdateProfileDto } from './update-profile.dto'

export class UpdateUserDto extends UpdateProfileDto {
	@IsOptional()
	@ArrayNotEmpty()
	@IsArray()
	@IsNumber({}, { each: true })
	promocodeIds?: number[]

	@IsOptional()
	@IsBoolean()
	isAdmin?: boolean

	@IsOptional()
	@IsBoolean()
	isSubscribed?: boolean
}
