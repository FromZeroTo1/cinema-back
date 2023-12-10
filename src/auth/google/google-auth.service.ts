import { HttpService } from '@nestjs/axios'
import {
	BadRequestException,
	HttpException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import { hash } from 'argon2'
import { firstValueFrom, map } from 'rxjs'
import { PrismaService } from 'src/prisma/prisma.service'
import { UserService } from 'src/user/user.service'
import { GoogleCodeDto } from './dto/google-code.dto'
import {
	IGoogleProfile,
	IResGoogleUser,
} from './interface/google-auth.interface'

@Injectable()
export class GoogleAuthService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly jwt: JwtService,
		private readonly configService: ConfigService,
		private readonly httpService: HttpService,
		private readonly userService: UserService
	) {}

	async validateUser(details: IResGoogleUser) {
		let user = await this.prisma.user.findUnique({
			where: {
				email: details.email,
			},
		})

		if (!user)
			user = await this.prisma.user.create({
				data: {
					login: details.login,
					email: details.email,
					password: await hash(details.email),
					avatarPath: details.avatarPath,
					isVisible: true,
				},
			})

		return {
			user: this.returnUserFields(user),
			provider: 'google',
			...(await this.issueTokens(user.id)),
		}
	}

	private async issueTokens(userId: number) {
		const data = { id: userId }

		const accessToken = this.jwt.sign(data, {
			expiresIn: '15m',
		})

		const refreshToken = this.jwt.sign(data, {
			expiresIn: '7d',
		})

		return { accessToken, refreshToken }
	}

	async getNewTokens(refreshToken: string) {
		const result = await this.jwt.verifyAsync(refreshToken)
		if (!result) throw new UnauthorizedException('Invalid refresh token')

		const user = await this.userService.byId(result.id, {
			isAdmin: true,
			isSubscribed: true,
		})

		const tokens = await this.issueTokens(user.id)

		return {
			user: this.returnUserFields(user),
			provider: 'google',
			...tokens,
		}
	}

	async getGoogleToken(code: string) {
		return firstValueFrom(
			this.httpService
				.post<{ access_token: string }>('https://oauth2.googleapis.com/token', {
					code,
					client_id: this.configService.get('GOOGLE_CLIENT_ID'),
					client_secret: this.configService.get('GOOGLE_SECRET'),
					redirect_uri: 'http://localhost:3000/google-auth',
					grant_type: 'authorization_code',
				})
				.pipe(map((res) => res.data))
		)
	}

	async getGoogleProfile(accessToken: string) {
		return firstValueFrom(
			this.httpService
				.get<IGoogleProfile>('https://www.googleapis.com/oauth2/v3/userinfo', {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				})
				.pipe(map((res) => res.data))
		)
	}

	async googleLogin({ code }: GoogleCodeDto) {
		if (!code) {
			throw new BadRequestException('Google code not found!')
		}

		try {
			const { access_token } = await this.getGoogleToken(code)

			const profile = await this.getGoogleProfile(access_token)

			return this.validateUser({
				login: profile.name,
				email: profile.email,
				avatarPath: profile.picture,
			})
		} catch (e) {
			throw new HttpException(e.response.data, e.response.status)
		}
	}

	private returnUserFields(user: User) {
		return {
			id: user.id,
			email: user.email,
			isAdmin: user.isAdmin,
			isSubscribed: user.isSubscribed,
		}
	}
}
