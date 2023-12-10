import { applyDecorators, UseGuards } from '@nestjs/common'
import { OnlySubscribedGuard } from '../guards/subscribe.guard'

export const Subscribe = () => applyDecorators(UseGuards(OnlySubscribedGuard))
