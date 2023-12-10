import {
	ArrayNotEmpty,
	IsArray,
	IsEmail,
	IsNumber,
	IsOptional,
	IsString,
} from 'class-validator'

export class UpdateProfileDto {
	@IsString()
	login: string

	@IsEmail()
	@IsString()
	email: string

	@IsOptional()
	@IsString()
	newPassword?: string

	@IsOptional()
	@IsString()
	avatarPath?: string

	@IsOptional()
	@ArrayNotEmpty()
	@IsArray()
	@IsNumber({}, { each: true })
	cardIds?: number[]
}
