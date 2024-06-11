import vine from '@vinejs/vine'

export const uploadSaveFileValidator = vine.compile(
  vine.object({
    alias: vine.string().trim().optional(),
    file: vine.file({ extnames: ['zip', 'eu4', 'v3', 'ck3', 'hoi4', 'eu5'] }),
  })
)
