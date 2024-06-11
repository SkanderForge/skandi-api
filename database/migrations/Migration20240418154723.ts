import { Migration } from '@mikro-orm/migrations'

export class Migration20240418154723 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "user" ("id" serial primary key, "full_name" varchar(255) null, "email" varchar(254) not null, "password" varchar(255) not null, "created_at" timestamptz(6) not null, "updated_at" timestamptz(6) null);'
    )
    this.addSql('alter table "user" add constraint "users_email_unique" unique ("email");')

    this.addSql('drop table if exists "adonis_schema" cascade;')

    this.addSql('drop table if exists "adonis_schema_versions" cascade;')

    this.addSql('drop table if exists "users" cascade;')
  }

  async down(): Promise<void> {
    this.addSql(
      'create table "adonis_schema" ("id" serial primary key, "name" varchar(255) not null, "batch" int4 not null, "migration_time" timestamptz(6) null default CURRENT_TIMESTAMP);'
    )

    this.addSql(
      'create table "adonis_schema_versions" ("version" int4 not null, constraint "adonis_schema_versions_pkey" primary key ("version"));'
    )

    this.addSql(
      'create table "users" ("id" serial primary key, "full_name" varchar(255) null, "email" varchar(254) not null, "password" varchar(255) not null, "created_at" timestamptz(6) not null, "updated_at" timestamptz(6) null);'
    )
    this.addSql('alter table "users" add constraint "users_email_unique" unique ("email");')

    this.addSql('drop table if exists "user" cascade;')
  }
}
