import { MinLength, IsString, IsEmail, IsOptional } from 'class-validator'

export class RegisterDto {
	@MinLength(5, {
		message: 'Login must be at least 5 characters long',
	})
	@IsString()
	login: string

	@IsEmail()
	email: string

	@MinLength(6, {
		message: 'Password must be at least 6 characters long',
	})
	@IsString()
	password: string

	@IsOptional()
	@IsString()
	avatarPath?: string
}

export class LoginDto {
	@IsEmail()
	email: string

	@MinLength(6, {
		message: 'Password must be at least 6 characters long',
	})
	@IsString()
	password: string
}
