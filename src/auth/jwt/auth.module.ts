import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { getJwtConfig } from 'src/config/jwt.config'
import { PrismaService } from 'src/prisma/prisma.service'
import { UserModule } from 'src/user/user.module'
import { UserService } from 'src/user/user.service'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtStrategy } from './strategy/jwt.strategy'
import { PaginationService } from 'src/pagination/pagination.service'

@Module({
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy, PrismaService, UserService, PaginationService],
	imports: [
		ConfigModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getJwtConfig,
		}),
		UserModule,
	],
})
export class AuthModule {}
