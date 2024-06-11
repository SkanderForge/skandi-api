import { Migration } from '@mikro-orm/migrations'

export class Migration20240506230410 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "save_linked_datasets" ("save_id" int not null, "dataset_id" int not null, constraint "save_linked_datasets_pkey" primary key ("save_id", "dataset_id"));'
    )

    this.addSql(
      'alter table "save_linked_datasets" add constraint "save_linked_datasets_save_id_foreign" foreign key ("save_id") references "save" ("id") on update cascade on delete cascade;'
    )
    this.addSql(
      'alter table "save_linked_datasets" add constraint "save_linked_datasets_dataset_id_foreign" foreign key ("dataset_id") references "dataset" ("id") on update cascade on delete cascade;'
    )

    this.addSql(
      'alter table "dataset" alter column "last_updated" type timestamptz(25) using ("last_updated"::timestamptz(25));'
    )

    this.addSql(
      'alter table "save" add column "stale" boolean not null default false, add column "meta_data" jsonb null;'
    )
    this.addSql(
      'alter table "save" alter column "uploaded_at" type timestamptz(25) using ("uploaded_at"::timestamptz(25));'
    )
    this.addSql(
      'alter table "save" alter column "reprocessed_at" type timestamptz(25) using ("reprocessed_at"::timestamptz(25));'
    )
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "save_linked_datasets" cascade;')

    this.addSql(
      'alter table "dataset" alter column "last_updated" type timestamptz(6) using ("last_updated"::timestamptz(6));'
    )

    this.addSql('alter table "save" drop column "stale", drop column "meta_data";')

    this.addSql(
      'alter table "save" alter column "uploaded_at" type timestamptz(6) using ("uploaded_at"::timestamptz(6));'
    )
    this.addSql(
      'alter table "save" alter column "reprocessed_at" type timestamptz(6) using ("reprocessed_at"::timestamptz(6));'
    )
  }
}
