import { Prisma } from '@prisma/client'
import { actorObject } from 'src/actor/object/actor.object'
import { directorObject } from 'src/director/object/director.object'
import { genreObject } from 'src/genre/object/genre.object'
import { groupObject } from 'src/group/object/group.object'
import { operatorObject } from 'src/operator/object/operator.object'
import { producerObject } from 'src/producer/object/producer.object'
import { scenaristObject } from 'src/scenarist/object/scenarist.object'

export const seriesDtoObject: Prisma.MediaSelect = {
	name: true,
	excerpt: true,
	description: true,
	poster: true,
	bigPoster: true,
	genres: { select: genreObject },
	groups: { select: groupObject },
	actors: { select: actorObject },
	directors: { select: directorObject },
	producers: { select: producerObject },
	operators: { select: operatorObject },
	scenarists: { select: scenaristObject },
	year: true,
	age: true,
	countries: true,
}
