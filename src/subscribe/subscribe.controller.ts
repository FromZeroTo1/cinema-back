import {
	Body,
	Controller,
	HttpCode,
	Post,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { Auth } from 'src/auth/jwt/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/jwt/decorators/user.decorator'
import { BuySubscribeDto } from './dto/buy-subscribe.dto'
import { PaymentStatusDto } from './dto/payment-status.dto'
import { SubscribeService } from './subscribe.service'

@Controller('subscribes')
export class SubscribeController {
	constructor(private readonly subscribeService: SubscribeService) {}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post()
	@Auth()
	placeOrder(@Body() dto: BuySubscribeDto, @CurrentUser('id') userId: number) {
		return this.subscribeService.placeOrder(dto, userId)
	}

	@HttpCode(200)
	@Post('status')
	async updateStatus(@Body() dto: PaymentStatusDto) {
		return this.subscribeService.updateStatus(dto)
	}
}
