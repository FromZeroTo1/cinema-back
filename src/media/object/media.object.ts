import { Prisma } from '@prisma/client'
import { actorObject } from 'src/actor/object/actor.object'
import { directorObject } from 'src/director/object/director.object'
import { genreObject } from 'src/genre/object/genre.object'
import { groupObject } from 'src/group/object/group.object'
import { movieObject } from 'src/movie/object/movie.object'
import { operatorObject } from 'src/operator/object/operator.object'
import { producerObject } from 'src/producer/object/producer.object'
import { scenaristObject } from 'src/scenarist/object/scenarist.object'
import { seasonObject } from 'src/season/object/season.object'

export const mediaObject: Prisma.MediaSelect = {
	id: true,
	name: true,
	slug: true,
	excerpt: true,
	description: true,
	poster: true,
	bigPoster: true,
	movie: { select: movieObject },
	seasons: { select: seasonObject },
	genres: { select: genreObject },
	actors: { select: actorObject },
	directors: { select: directorObject },
	producers: { select: producerObject },
	operators: { select: operatorObject },
	scenarists: { select: scenaristObject },
	groups: { select: groupObject },
	year: true,
	age: true,
	countries: true,
	averageRating: true,
	totalViews: true,
	totalLikes: true,
	isMovie: true,
	isSeries: true,
	isVisible: true,
	createdAt: true,
}
