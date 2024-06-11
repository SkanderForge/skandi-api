import { defineConfig } from '@mikro-orm/postgresql'
import { TsMorphMetadataProvider } from '@mikro-orm/reflection'
import { EntityGenerator } from '@mikro-orm/entity-generator'
import { Migrator } from '@mikro-orm/migrations'



export default defineConfig({
  clientUrl:
  process.env.env.POSTGRES_URL,
  entities: ['build/**/*.entity.js'],
  entitiesTs: ['app/entities/**'],
  metadataProvider: TsMorphMetadataProvider,
  debug: true,
  migrations: {
    path: './database/migrations',
    glob: '!(*.d).{js,ts}',
    transactional: true,
    disableForeignKeys: true,
    allOrNothing: true,
    emit: 'ts',
    snapshot: false,
  },
  tsNode: true,
  extensions: [EntityGenerator, Migrator],
})
