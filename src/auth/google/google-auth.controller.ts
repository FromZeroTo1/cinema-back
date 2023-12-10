import {
	Body,
	Controller,
	HttpCode,
	Post,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { GoogleCodeDto } from './dto/google-code.dto'
import { GoogleAuthService } from './google-auth.service'
import { RefreshTokenDto } from '../jwt/dto/refresh-token.dto'

@Controller('auth/google')
export class GoogleAuthController {
	constructor(private readonly googleAuthService: GoogleAuthService) {}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('login')
	async googleAuth(@Body() dto: GoogleCodeDto) {
		return this.googleAuthService.googleLogin(dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('login/access-token')
	async getNewTokens(@Body() dto: RefreshTokenDto) {
		return this.googleAuthService.getNewTokens(dto.refreshToken)
	}
}
