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
import { CurrentUser } from 'src/auth/jwt/decorators/user.decorator'
import { UserQueryDto } from './dto/query-user.dto'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@UsePipes(new ValidationPipe())
	@Get()
	async getAll(@Query() queryDto: UserQueryDto) {
		return this.userService.getAll(queryDto)
	}

	@Get('profile')
	@Auth()
	async getProfile(@CurrentUser('id') id: number) {
		return this.userService.byId(id)
	}

	@UsePipes(new ValidationPipe())
	@Auth()
	@HttpCode(200)
	@Put('profile')
	async updateProfile(
		@CurrentUser('id') id: number,
		@Body() dto: UpdateProfileDto
	) {
		return this.userService.updateProfile(id, dto)
	}

	// Admin Place

	@Get(':id')
	@Auth('admin')
	async get(@Param('id') id: string) {
		return this.userService.byId(+id)
	}

	@Put('toggle-visibility/:id')
	@HttpCode(200)
	@Auth('admin')
	async toggleVisibility(@Param('id') id: string) {
		return this.userService.toggleVisibility(+id)
	}

	@Post()
	@HttpCode(200)
	@Auth('admin')
	async create() {
		return this.userService.create()
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth('admin')
	async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
		return this.userService.update(+id, dto)
	}

	@Delete(':id')
	@HttpCode(200)
	@Auth('admin')
	async delete(@Param('id') id: string) {
		return this.userService.delete(+id)
	}
}
