import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator'
import { PaginationDto } from 'src/pagination/dto/pagination.dto'

export enum EnumMediaSort {
	NEWEST = 'newest',
	OLDEST = 'oldest',
	POPULAR = 'by-views',
	RATED = 'by-rating',
}

export class QueryMediaDto extends PaginationDto {
	@IsOptional()
	@IsEnum(EnumMediaSort)
	sort?: EnumMediaSort

	@IsOptional()
	@IsString()
	searchTerm?: string

	@IsOptional()
	@IsString()
	group?: string

	@IsOptional()
	@IsString()
	genre?: string

	@IsOptional()
	@IsString()
	actor?: string

	@IsOptional()
	@IsString()
	director?: string

	@IsOptional()
	@IsString()
	producer?: string

	@IsOptional()
	@IsString()
	scenarist?: string

	@IsOptional()
	@IsString()
	operator?: string

	@IsOptional()
	@IsString()
	year?: string

	@IsOptional()
	@IsString()
	age?: string

	@IsOptional()
	@IsString()
	country?: string

	@IsOptional()
	@IsString()
	averageRating?: string

	@IsOptional()
	@IsString()
	isMovie?: string

	@IsOptional()
	@IsString()
	isSeries?: string

	@IsOptional()
	@IsString()
	isVisible?: string
}
