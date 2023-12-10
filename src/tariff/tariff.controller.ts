import { Controller, Get, HttpCode, Param, Put } from '@nestjs/common'
import { Auth } from 'src/auth/jwt/decorators/auth.decorator'
import { TariffService } from './tariff.service'

@Controller('tariff')
export class TariffController {
	constructor(private readonly tariffService: TariffService) {}

	@Get(':id')
	@Auth()
	async get(@Param('id') id: string) {
		return this.tariffService.byId(+id)
	}

	@Put('toggle-visibility/:id')
	@HttpCode(200)
	@Auth('admin')
	async toggleVisibility(@Param('id') id: string) {
		return this.tariffService.toggleVisibility(+id)
	}
}
