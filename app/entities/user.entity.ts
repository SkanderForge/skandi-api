import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core'

@Entity()
export class User {
  @PrimaryKey()
  id!: number

  @Property({ length: 255, nullable: true })
  fullName?: string

  @Unique()
  @Property({ length: 255 })
  steamId!: string

  @Unique()
  @Property({ length: 255 })
  discordId?: string

  @Property({ length: 255 })
  avatarUrl?: string

  @Property({ length: 6 })
  createdAt!: Date
}
