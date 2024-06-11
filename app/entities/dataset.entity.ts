import {
  Cascade,
  Collection,
  Entity,
  OneToMany,
  Opt,
  PrimaryKey,
  PrimaryKeyProp,
  Property,
  Unique,
} from '@mikro-orm/core'
import { Datafile } from '#entities/datafile.entity'

@Entity()
export class Dataset {
  constructor(key: string, gameVersion: string) {
    this.key = key
    this.gameVersion = gameVersion
  }

  [PrimaryKeyProp]?: ['key', 'gameVersion']

  @PrimaryKey()
  key!: string

  @PrimaryKey()
  gameVersion!: string

  @Unique()
  @Property({ length: 255 })
  name!: string

  @Property({ length: 255 })
  steamId?: string

  @Property({ length: 255 })
  archiveName?: string

  @Property({ length: 25 })
  lastUpdated?: Date & Opt = new Date()

  @OneToMany({
    entity: () => Datafile,
    mappedBy: 'belongsTo',
    cascade: [Cascade.PERSIST, Cascade.REMOVE],
  })
  datafiles = new Collection<Datafile>(this)

  @Property({ length: 30 })
  mapShapefileUrl: string

  @Property()
  isVanilla?: boolean & Opt = false
}
