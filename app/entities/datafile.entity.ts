import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core'
import { Dataset } from '#entities/dataset.entity'
import type { Rel } from '@mikro-orm/core'
import type {DataFileVal} from "../types/index.js";

@Entity()
export class Datafile {
  constructor(key: string, data: DataFileVal, unique: boolean) {
    this.key = key
    this.data = data
    this.data_stringified = JSON.stringify(data)
    this.unique = unique
  }

  @PrimaryKey()
  id!: number

  @Property({ length: 255 })
  key!: string

  @Property({ type: 'json', nullable: true })
  data: DataFileVal

  @Property({ type: 'text', nullable: true, length: 25*1024*1024 })
  data_stringified: string


  @ManyToOne(() => Dataset)
  belongsTo!: Rel<Dataset>

  @Property()
  unique: boolean;


}
