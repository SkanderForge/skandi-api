import {
  Cascade,
  Collection,
  Entity,
  Enum,
  ManyToMany,
  ManyToOne,
  Opt,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core'
import { User } from '#entities/user.entity'
import { GamesEnum } from '../types/index.js'
import type { Countries, Provinces, MetaData, WarsData } from '../types/index.js'
import { Dataset } from '#entities/dataset.entity'
@Entity()
export class Save {

  @Enum({ items: () => GamesEnum, nativeEnumName: 'games' })
  game!: GamesEnum

  @PrimaryKey()
  @Property({ length: 255 })
  key!: string

  @Unique()
  @Property({ length: 255 })
  alias!: string

  @ManyToOne(() => User)
  uploader!: User

  @Property({ length: 25 })
  uploadedAt?: Date & Opt = new Date()

  @Property({ length: 255 })
  storageUrl?: string

  @Property()
  stale: boolean & Opt = false

  @Property({ type: 'json', nullable: true })
  countriesData: Countries

  @Property({ type: 'json', nullable: true })
  provincesData: Provinces

  @Property({ type: 'json', nullable: true })
  warsData: WarsData

  @Property({ type: 'json', nullable: true })
  metaData: MetaData

  @ManyToMany({ entity: () => Dataset, cascade: [Cascade.PERSIST, Cascade.REMOVE], owner: true })
  linkedDatasets = new Collection<Dataset>(this)

  @Property({ length: 25 })
  reprocessedAt?: Date
}
