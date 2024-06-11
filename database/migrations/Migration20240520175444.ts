import { Migration } from '@mikro-orm/migrations';

export class Migration20240520175444 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "datafile" drop constraint "datafile_belongs_to_id_foreign";');

    this.addSql('alter table "save_linked_datasets" drop constraint "save_linked_datasets_dataset_id_foreign";');

    this.addSql('alter table "dataset" drop constraint "dataset_key_unique";');
    this.addSql('alter table "dataset" drop constraint "dataset_pkey";');
    this.addSql('alter table "dataset" drop column "id";');

    this.addSql('alter table "dataset" alter column "game_version" type varchar(255) using ("game_version"::varchar(255));');
    this.addSql('alter table "dataset" alter column "game_version" set not null;');
    this.addSql('alter table "dataset" alter column "last_updated" type timestamptz(25) using ("last_updated"::timestamptz(25));');
    this.addSql('alter table "dataset" add constraint "dataset_pkey" primary key ("key", "game_version");');

    this.addSql('alter table "datafile" drop column "belongs_to_id";');

    this.addSql('alter table "datafile" add column "belongs_to_key" varchar(255) not null, add column "belongs_to_game_version" varchar(255) not null;');
    this.addSql('alter table "datafile" add constraint "datafile_belongs_to_key_belongs_to_game_version_foreign" foreign key ("belongs_to_key", "belongs_to_game_version") references "dataset" ("key", "game_version") on update cascade;');

    this.addSql('alter table "save" alter column "uploaded_at" type timestamptz(25) using ("uploaded_at"::timestamptz(25));');
    this.addSql('alter table "save" alter column "reprocessed_at" type timestamptz(25) using ("reprocessed_at"::timestamptz(25));');

    this.addSql('alter table "save_linked_datasets" drop constraint "save_linked_datasets_pkey";');
    this.addSql('alter table "save_linked_datasets" drop column "dataset_id";');

    this.addSql('alter table "save_linked_datasets" add column "dataset_key" varchar(255) not null, add column "dataset_game_version" varchar(255) not null;');
    this.addSql('alter table "save_linked_datasets" add constraint "save_linked_datasets_dataset_key_dataset_game_version_foreign" foreign key ("dataset_key", "dataset_game_version") references "dataset" ("key", "game_version") on update cascade on delete cascade;');
    this.addSql('alter table "save_linked_datasets" add constraint "save_linked_datasets_pkey" primary key ("save_id", "dataset_key", "dataset_game_version");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "datafile" drop constraint "datafile_belongs_to_key_belongs_to_game_version_foreign";');

    this.addSql('alter table "save_linked_datasets" drop constraint "save_linked_datasets_dataset_key_dataset_game_version_foreign";');

    this.addSql('alter table "datafile" drop column "belongs_to_key", drop column "belongs_to_game_version";');

    this.addSql('alter table "datafile" add column "belongs_to_id" int4 not null;');
    this.addSql('alter table "datafile" add constraint "datafile_belongs_to_id_foreign" foreign key ("belongs_to_id") references "dataset" ("id") on update cascade on delete no action;');

    this.addSql('alter table "dataset" drop constraint "dataset_pkey";');

    this.addSql('alter table "dataset" add column "id" int4 not null;');
    this.addSql('alter table "dataset" alter column "game_version" type varchar(10) using ("game_version"::varchar(10));');
    this.addSql('alter table "dataset" alter column "game_version" drop not null;');
    this.addSql('alter table "dataset" alter column "last_updated" type timestamptz(6) using ("last_updated"::timestamptz(6));');
    this.addSql('alter table "dataset" add constraint "dataset_key_unique" unique ("key");');
    this.addSql('alter table "dataset" add constraint "dataset_pkey" primary key ("id");');

    this.addSql('alter table "save" alter column "uploaded_at" type timestamptz(6) using ("uploaded_at"::timestamptz(6));');
    this.addSql('alter table "save" alter column "reprocessed_at" type timestamptz(6) using ("reprocessed_at"::timestamptz(6));');

    this.addSql('alter table "save_linked_datasets" drop constraint "save_linked_datasets_pkey";');
    this.addSql('alter table "save_linked_datasets" drop column "dataset_key", drop column "dataset_game_version";');

    this.addSql('alter table "save_linked_datasets" add column "dataset_id" int4 not null;');
    this.addSql('alter table "save_linked_datasets" add constraint "save_linked_datasets_dataset_id_foreign" foreign key ("dataset_id") references "dataset" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "save_linked_datasets" add constraint "save_linked_datasets_pkey" primary key ("save_id", "dataset_id");');
  }

}
