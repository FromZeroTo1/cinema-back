import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ActorModule } from './actor/actor.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { GoogleAuthModule } from './auth/google/google-auth.module'
import { AuthModule } from './auth/jwt/auth.module'
import { CardModule } from './card/card.module'
import { DirectorModule } from './director/director.module'
import { EpisodeModule } from './episode/episode.module'
import { FileModule } from './file/file.module'
import { GenreModule } from './genre/genre.module'
import { GroupModule } from './group/group.module'
import { MediaModule } from './media/media.module'
import { MovieModule } from './movie/movie.module'
import { OperatorModule } from './operator/operator.module'
import { PaginationModule } from './pagination/pagination.module'
import { PrismaService } from './prisma/prisma.service'
import { ProducerModule } from './producer/producer.module'
import { PromocodeModule } from './promocode/promocode.module'
import { ScenaristModule } from './scenarist/scenarist.module'
import { SubscribeModule } from './subscribe/subscribe.module'
import { TariffModule } from './tariff/tariff.module'
import { UserModule } from './user/user.module'

@Module({
	imports: [
		ConfigModule.forRoot(),
		UserModule,
		AuthModule,
		MediaModule,
		GenreModule,
		ActorModule,
		DirectorModule,
		ProducerModule,
		ScenaristModule,
		OperatorModule,
		TariffModule,
		SubscribeModule,
		PaginationModule,
		MovieModule,
		EpisodeModule,
		FileModule,
		GroupModule,
		PromocodeModule,
		CardModule,
		GoogleAuthModule,
	],
	controllers: [AppController],
	providers: [AppService, PrismaService],
})
export class AppModule {}
