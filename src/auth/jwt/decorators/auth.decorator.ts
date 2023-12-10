import { UseGuards, applyDecorators } from '@nestjs/common'
import { OnlyAdminGuard } from '../guards/admin.guard'
import { JwtAuthGuard } from '../guards/jwt.guard'
import { TypeRole } from '../type/auth.type'

export const Auth = (role: TypeRole = 'user') =>
	applyDecorators(
		role === 'admin'
			? UseGuards(JwtAuthGuard, OnlyAdminGuard)
			: UseGuards(JwtAuthGuard)
	)
