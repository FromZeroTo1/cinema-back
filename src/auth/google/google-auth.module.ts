import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { getJwtConfig } from 'src/config/jwt.config'
import { PaginationService } from 'src/pagination/pagination.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { UserModule } from 'src/user/user.module'
import { UserService } from 'src/user/user.service'
import { GoogleAuthController } from './google-auth.controller'
import { GoogleAuthService } from './google-auth.service'
import { GoogleStrategy } from './strategy/google-auth.strategy'

@Module({
	controllers: [GoogleAuthController],
	providers: [
		GoogleAuthService,
		GoogleStrategy,
		PrismaService,
		UserService,
		PaginationService,
	],
	imports: [
		ConfigModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getJwtConfig,
		}),
		UserModule,
		HttpModule,
	],
})
export class GoogleAuthModule {}
