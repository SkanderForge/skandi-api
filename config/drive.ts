import env from '#start/env'

const driveConfig = {
  disks: {
    gcs: {
      driver: 'gcs',
      visibility: 'private',
      keyFilename: env.get('GCS_KEY_FILENAME'),
      bucket: env.get('GCS_BUCKET'),
      usingUniformAcl: true,
    },
  },
  disk: 'gcs',
}

export default driveConfig
