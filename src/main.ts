import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { PrismaService } from './prisma/prisma.service'
import * as session from 'express-session'
import * as passport from 'passport'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	const prismaService = app.get(PrismaService)
	await prismaService.enableShutdownHooks(app)

	app.setGlobalPrefix('api')
	app.enableCors()
	await app.listen(process.env.PORT)

	app.use(
		session({
			cookie: {
				maxAge: 86400000
			},
			secret: 'apksngioesdanvolkijqsbuiovrqwen',
			resave: false,
			saveUninitialized: false
		})
	)
	app.use(passport.initialize())
	app.use(passport.session())
}
bootstrap()
