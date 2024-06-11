import { Migration } from '@mikro-orm/migrations'

export class Migration20240508110848 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "dataset" alter column "last_updated" type timestamptz(25) using ("last_updated"::timestamptz(25));'
    )

    this.addSql(
      'alter table "save" alter column "uploaded_at" type timestamptz(25) using ("uploaded_at"::timestamptz(25));'
    )
    this.addSql(
      'alter table "save" alter column "reprocessed_at" type timestamptz(25) using ("reprocessed_at"::timestamptz(25));'
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "dataset" alter column "last_updated" type timestamptz(6) using ("last_updated"::timestamptz(6));'
    )

    this.addSql(
      'alter table "save" alter column "uploaded_at" type timestamptz(6) using ("uploaded_at"::timestamptz(6));'
    )
    this.addSql(
      'alter table "save" alter column "reprocessed_at" type timestamptz(6) using ("reprocessed_at"::timestamptz(6));'
    )
  }
}