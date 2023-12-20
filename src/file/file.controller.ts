import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Query,
	UploadedFile,
	UseInterceptors,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Auth } from 'src/auth/jwt/decorators/auth.decorator'
import { QueryFilesDto } from './dto/query-file.dto'
import { FileService } from './file.service'
import { DirectoryDto } from './dto/directory.dto'

@Controller('files')
export class FileController {
	constructor(private readonly fileService: FileService) {}

	@UsePipes(new ValidationPipe())
	@Get()
	async getAll(@Query() queryDto: QueryFilesDto) {
		return this.fileService.getAll(queryDto)
	}

	@Get('directories')
	async getDirectories() {
		return this.fileService.getDirectories()
	}

	@Post()
	@HttpCode(200)
	@Auth('admin')
	@UseInterceptors(FileInterceptor('file'))
	async uploadFile(
		@UploadedFile() file: Express.Multer.File,
		@Query('folder') folder?: string
	) {
		return this.fileService.saveFiles([file], folder)
	}

	@UsePipes(new ValidationPipe())
	@Post('add-directory')
	@HttpCode(200)
	@Auth('admin')
	async addDirectory(@Body() dto: DirectoryDto) {
		return this.fileService.addDirectory(dto)
	}

	@Delete('directory/:folder')
	@HttpCode(200)
	@Auth('admin')
	async deleteDirectory(@Param('folder') folder: string) {
		return this.fileService.deleteDirectory(folder)
	}

	@Delete('file/:path')
	@HttpCode(200)
	@Auth('admin')
	async deleteFile(@Param('path') path: string) {
		return this.fileService.deleteFile(path)
	}
}
