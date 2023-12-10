import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator'
import { PaginationDto } from 'src/pagination/dto/pagination.dto'
import { EnumSort } from 'src/query-dto/query.dto'

export class UserQueryDto extends PaginationDto {
	@IsOptional()
	@IsEnum(EnumSort)
	sort?: EnumSort

	@IsOptional()
	@IsString()
	searchTerm?: string

	@IsOptional()
	@IsBoolean()
	visible?: boolean
}
