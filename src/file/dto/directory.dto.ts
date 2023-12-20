import { IsString } from 'class-validator'

export class DirectoryDto {
  @IsString()
  folder: string
}
