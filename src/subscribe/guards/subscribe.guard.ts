import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
} from '@nestjs/common'
import { User } from '@prisma/client'

@Injectable()
export class OnlySubscribedGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest<{ user: User }>()
		const user = request.user

		if (!user.isSubscribed)
			throw new ForbiddenException('You do not have signatory rights.')

		return user.isSubscribed
	}
}
