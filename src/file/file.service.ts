import { Injectable } from '@nestjs/common'
import { path } from 'app-root-path'
import { ensureDir, readdirSync, removeSync, writeFile } from 'fs-extra'
import * as classicPath from 'path'
import { QueryFilesDto } from './dto/query-file.dto'
import { FileResponse } from './interface/file.interface'

@Injectable()
export class FileService {
	async getAll(dto: QueryFilesDto = {}) {
		if (dto.folder) {
			const folderPath = classicPath.join(path, 'uploads', dto.folder)
			return readdirSync(folderPath).map((file) => ({
				name: file,
				url: classicPath.join('/uploads', dto.folder, file).replace(/\\/g, '/'),
			}))
		} else {
			const allFiles = []
			const baseFolderPath = classicPath.join(path, 'uploads')
			const allFolders = readdirSync(baseFolderPath, { withFileTypes: true })
				.filter((dirent) => dirent.isDirectory())
				.map((dirent) => dirent.name)

			allFolders.forEach((folder) => {
				const folderPath = classicPath.join(baseFolderPath, folder)
				const filesInFolder = readdirSync(folderPath)
				allFiles.push(
					...filesInFolder.map((file) => ({
						name: file,
						url: classicPath.join('/uploads', folder, file).replace(/\\/g, '/'),
					}))
				)
			})

			return allFiles
		}
	}

	async getDirectories() {
		return readdirSync('uploads', { withFileTypes: true })
			.filter((dirent) => dirent.isDirectory())
			.map((dirent) => dirent.name)
	}

	async saveFiles(
		files: Express.Multer.File[],
		folder: string = 'images'
	): Promise<FileResponse[]> {
		const uploadFolder = `${path}/uploads/${folder}`
		await ensureDir(uploadFolder)

		const res: FileResponse[] = await Promise.all(
			files.map(async (file) => {
				await writeFile(`${uploadFolder}/${file.originalname}`, file.buffer)

				return {
					url: `/uploads/${folder}/${file.originalname}`,
					name: file.originalname,
				}
			})
		)

		return res
	}

	async deleteFile(path: string) {
		removeSync(path)
	}
}
