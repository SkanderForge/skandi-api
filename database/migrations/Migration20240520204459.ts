import { Migration } from '@mikro-orm/migrations';

export class Migration20240520204459 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "save_linked_datasets" drop constraint "save_linked_datasets_save_id_foreign";');

    this.addSql('alter table "dataset" alter column "last_updated" type timestamptz(25) using ("last_updated"::timestamptz(25));');

    this.addSql('alter table "save" drop constraint "save_key_unique";');
    this.addSql('alter table "save" drop constraint "save_pkey";');
    this.addSql('alter table "save" drop column "id";');

    this.addSql('alter table "save" alter column "uploaded_at" type timestamptz(25) using ("uploaded_at"::timestamptz(25));');
    this.addSql('alter table "save" alter column "reprocessed_at" type timestamptz(25) using ("reprocessed_at"::timestamptz(25));');
    this.addSql('alter table "save" add constraint "save_pkey" primary key ("key");');

    this.addSql('alter table "save_linked_datasets" drop constraint "save_linked_datasets_pkey";');
    this.addSql('alter table "save_linked_datasets" drop column "save_id";');

    this.addSql('alter table "save_linked_datasets" add column "save_key" varchar(255) not null;');
    this.addSql('alter table "save_linked_datasets" add constraint "save_linked_datasets_save_key_foreign" foreign key ("save_key") references "save" ("key") on update cascade on delete cascade;');
    this.addSql('alter table "save_linked_datasets" add constraint "save_linked_datasets_pkey" primary key ("save_key", "dataset_key", "dataset_game_version");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "save_linked_datasets" drop constraint "save_linked_datasets_save_key_foreign";');

    this.addSql('alter table "dataset" alter column "last_updated" type timestamptz(6) using ("last_updated"::timestamptz(6));');

    this.addSql('alter table "save" drop constraint "save_pkey";');

    this.addSql('alter table "save" add column "id" serial;');
    this.addSql('alter table "save" alter column "uploaded_at" type timestamptz(6) using ("uploaded_at"::timestamptz(6));');
    this.addSql('alter table "save" alter column "reprocessed_at" type timestamptz(6) using ("reprocessed_at"::timestamptz(6));');
    this.addSql('alter table "save" add constraint "save_key_unique" unique ("key");');
    this.addSql('alter table "save" add constraint "save_pkey" primary key ("id");');

    this.addSql('alter table "save_linked_datasets" drop constraint "save_linked_datasets_pkey";');
    this.addSql('alter table "save_linked_datasets" drop column "save_key";');

    this.addSql('alter table "save_linked_datasets" add column "save_id" int4 not null;');
    this.addSql('alter table "save_linked_datasets" add constraint "save_linked_datasets_save_id_foreign" foreign key ("save_id") references "save" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "save_linked_datasets" add constraint "save_linked_datasets_pkey" primary key ("save_id", "dataset_key", "dataset_game_version");');
  }

}
