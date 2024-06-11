import { Migration } from '@mikro-orm/migrations'

export class Migration20240422194242 extends Migration {
  async up(): Promise<void> {
    this.addSql("create type \"games\" as enum ('eu4', 'eu5', 'vic3', 'ck3', 'hoi4');")
    this.addSql(
      'create table "dataset" ("id" serial primary key, "key" varchar(255) not null, "name" varchar(255) not null, "steam_id" varchar(255) null, "game_version" varchar(10) null, "archive_name" varchar(255) null, "last_updated" timestamptz(25) null, "map_shapefile_url" varchar(30) not null);'
    )
    this.addSql('alter table "dataset" add constraint "dataset_key_unique" unique ("key");')
    this.addSql('alter table "dataset" add constraint "dataset_name_unique" unique ("name");')

    this.addSql(
      'create table "datafile" ("id" serial primary key, "key" varchar(255) not null, "data" jsonb null, "belongs_to_id" int not null);'
    )
    this.addSql('alter table "datafile" add constraint "datafile_key_unique" unique ("key");')

    this.addSql(
      'create table "save" ("id" serial primary key, "game" "games" not null, "key" varchar(255) not null, "alias" varchar(255) not null, "uploader_id" int not null, "uploaded_at" timestamptz(25) null, "storage_url" varchar(255) null, "countries_data" jsonb null, "provinces_data" jsonb null, "wars_data" jsonb null, "reprocessed_at" timestamptz(25) null);'
    )
    this.addSql('alter table "save" add constraint "save_key_unique" unique ("key");')
    this.addSql('alter table "save" add constraint "save_alias_unique" unique ("alias");')

    this.addSql(
      'alter table "datafile" add constraint "datafile_belongs_to_id_foreign" foreign key ("belongs_to_id") references "dataset" ("id") on update cascade;'
    )

    this.addSql(
      'alter table "save" add constraint "save_uploader_id_foreign" foreign key ("uploader_id") references "user" ("id") on update cascade;'
    )

    this.addSql('alter table "user" drop constraint "users_email_unique";')
    this.addSql('alter table "user" drop column "email", drop column "updated_at";')

    this.addSql(
      'alter table "user" add column "discord_id" varchar(255) null, add column "avatar_url" varchar(255) null;'
    )
    this.addSql('alter table "user" rename column "password" to "steam_id";')
    this.addSql('alter table "user" add constraint "user_steam_id_unique" unique ("steam_id");')
    this.addSql('alter table "user" add constraint "user_discord_id_unique" unique ("discord_id");')
  }

  async down(): Promise<void> {
    this.addSql('alter table "datafile" drop constraint "datafile_belongs_to_id_foreign";')

    this.addSql('drop table if exists "dataset" cascade;')

    this.addSql('drop table if exists "datafile" cascade;')

    this.addSql('drop table if exists "save" cascade;')

    this.addSql('alter table "user" drop constraint "user_steam_id_unique";')
    this.addSql('alter table "user" drop constraint "user_discord_id_unique";')
    this.addSql('alter table "user" drop column "discord_id", drop column "avatar_url";')

    this.addSql(
      'alter table "user" add column "email" varchar(254) not null, add column "updated_at" timestamptz(6) null;'
    )
    this.addSql('alter table "user" rename column "steam_id" to "password";')
    this.addSql('alter table "user" add constraint "users_email_unique" unique ("email");')

    this.addSql('drop type "games";')
  }
}
