import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { Auth } from 'src/auth/jwt/decorators/auth.decorator'
import { QueryPromocodeDto } from './dto/query-promocode.dto'
import { UpdatePromocodeDto } from './dto/update-promocode.dto'
import { PromocodeService } from './promocode.service'

@Controller('promocodes')
export class PromocodeController {
	constructor(private readonly promocodeService: PromocodeService) {}

	@UsePipes(new ValidationPipe())
	@Get()
	async getAll(@Query() queryDto: QueryPromocodeDto) {
		return this.promocodeService.getAll(queryDto)
	}

	// Admin Place

	@Get(':id')
	@Auth()
	async get(@Param('id') id: string) {
		return this.promocodeService.byId(+id)
	}

	@Put('toggle-visibility/:id')
	@HttpCode(200)
	@Auth('admin')
	async toggleVisibility(@Param('id') id: string) {
		return this.promocodeService.toggleVisibility(+id)
	}
	@Post()
	@HttpCode(200)
	@Auth()
	async create() {
		return this.promocodeService.create()
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth()
	async update(@Param('id') id: string, @Body() dto: UpdatePromocodeDto) {
		return this.promocodeService.update(+id, dto)
	}

	@Delete(':id')
	@HttpCode(200)
	@Auth()
	async delete(@Param('id') id: string) {
		return this.promocodeService.delete(+id)
	}
}
