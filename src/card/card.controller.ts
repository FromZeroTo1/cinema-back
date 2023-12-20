import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { Auth } from 'src/auth/jwt/decorators/auth.decorator'
import { CardService } from './card.service'
import { UpdateCardDto } from './dto/update-card.dto'

@Controller('cards')
export class CardController {
	constructor(private readonly cardService: CardService) {}

	// Admin Place

	@Get(':id')
	@Auth()
	async get(@Param('id') id: string) {
		return this.cardService.byId(+id)
	}

	@Post()
	@HttpCode(200)
	@Auth()
	async create() {
		return this.cardService.create()
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth()
	async update(@Param('id') id: string, @Body() dto: UpdateCardDto) {
		return this.cardService.update(+id, dto)
	}

	@Delete(':id')
	@HttpCode(200)
	@Auth()
	async delete(@Param('id') id: string) {
		return this.cardService.delete(+id)
	}
}
