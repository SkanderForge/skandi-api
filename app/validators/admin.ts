import vine from '@vinejs/vine'
import { GamesEnum } from '../types/index.js'

export const uploadDatasetValidator = vine.compile(
  vine.object({
    gameVersion: vine.string().trim().minLength(3),
    alias: vine.string().trim(),
    game: vine.enum(GamesEnum),
    overwrite: vine.boolean().optional(),
    key: vine.string().minLength(8),
    steamId: vine.string().trim().minLength(12).optional(),
    archive: vine.file({ extnames: ['zip'] }),
  })
)
