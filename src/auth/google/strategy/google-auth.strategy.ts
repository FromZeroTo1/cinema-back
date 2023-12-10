import { PassportStrategy } from '@nestjs/passport'
import { config } from 'dotenv'
import { Strategy } from 'passport-google-oauth20'

import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { GoogleAuthService } from '../google-auth.service'

config()

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
	constructor(
		private readonly configService: ConfigService,
		private readonly googleAuthService: GoogleAuthService
	) {
		super({
			clientID: configService.get('GOOGLE_CLIENT_ID'),
			clientSecret: configService.get('GOOGLE_SECRET'),
			callbackURL: 'http://localhost:4200/api/auth/google/redirect',
			scope: ['email', 'profile'],
		})
	}

	async validate(profile: any): Promise<any> {
		const { displayName, emails, photos } = profile

		return this.googleAuthService.validateUser({
			login: displayName,
			email: emails[0].value,
			avatarPath: photos[0].value,
		})
	}
}
