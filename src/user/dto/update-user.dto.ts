import {
	ArrayNotEmpty,
	IsArray,
	IsBoolean,
	IsEmail,
	IsNumber,
	IsOptional,
	IsString,
} from 'class-validator'

export class UpdateUserDto {
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
	promocodes?: number[]

	@IsOptional()
	@IsBoolean()
	isAdmin?: boolean

	@IsOptional()
	@IsBoolean()
	isSubscribed?: boolean
}
