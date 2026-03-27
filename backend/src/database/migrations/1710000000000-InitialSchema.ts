import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1710000000000 implements MigrationInterface {
  name = 'InitialSchema1710000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "email" varchar(255) NOT NULL UNIQUE,
        "password_hash" varchar(255) NOT NULL,
        "name" varchar(255) NOT NULL,
        "avatar" varchar(500),
        "role" varchar(50) NOT NULL DEFAULT 'user',
        "totp_secret" varchar(255),
        "is_active" boolean NOT NULL DEFAULT true,
        "last_login_at" timestamp,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now()
      )
    `);

    // Create sessions table
    await queryRunner.query(`
      CREATE TABLE "sessions" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "token" varchar(500) NOT NULL UNIQUE,
        "expires_at" timestamp NOT NULL,
        "created_at" timestamp NOT NULL DEFAULT now()
      )
    `);

    // Create api_keys table
    await queryRunner.query(`
      CREATE TABLE "api_keys" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "name" varchar(255) NOT NULL,
        "key" varchar(500) NOT NULL UNIQUE,
        "last_used_at" timestamp,
        "expires_at" timestamp,
        "created_at" timestamp NOT NULL DEFAULT now()
      )
    `);

    // Create projects table
    await queryRunner.query(`
      CREATE TABLE "projects" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" varchar(255) NOT NULL,
        "description" text,
        "owner_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "status" varchar(50) NOT NULL DEFAULT 'active',
        "settings" jsonb NOT NULL DEFAULT '{}',
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now()
      )
    `);

    // Create project_members table
    await queryRunner.query(`
      CREATE TABLE "project_members" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "project_id" uuid NOT NULL REFERENCES "projects"("id") ON DELETE CASCADE,
        "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "role" varchar(50) NOT NULL,
        "joined_at" timestamp NOT NULL DEFAULT now(),
        UNIQUE("project_id", "user_id")
      )
    `);

    // Create indexes
    await queryRunner.query(`CREATE INDEX "idx_users_email" ON "users"("email")`);
    await queryRunner.query(`CREATE INDEX "idx_sessions_user_id" ON "sessions"("user_id")`);
    await queryRunner.query(`CREATE INDEX "idx_sessions_token" ON "sessions"("token")`);
    await queryRunner.query(`CREATE INDEX "idx_api_keys_user_id" ON "api_keys"("user_id")`);
    await queryRunner.query(`CREATE INDEX "idx_api_keys_key" ON "api_keys"("key")`);
    await queryRunner.query(`CREATE INDEX "idx_projects_owner_id" ON "projects"("owner_id")`);
    await queryRunner.query(
      `CREATE INDEX "idx_project_members_project_id" ON "project_members"("project_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_project_members_user_id" ON "project_members"("user_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX "idx_project_members_user_id"`);
    await queryRunner.query(`DROP INDEX "idx_project_members_project_id"`);
    await queryRunner.query(`DROP INDEX "idx_projects_owner_id"`);
    await queryRunner.query(`DROP INDEX "idx_api_keys_key"`);
    await queryRunner.query(`DROP INDEX "idx_api_keys_user_id"`);
    await queryRunner.query(`DROP INDEX "idx_sessions_token"`);
    await queryRunner.query(`DROP INDEX "idx_sessions_user_id"`);
    await queryRunner.query(`DROP INDEX "idx_users_email"`);

    // Drop tables
    await queryRunner.query(`DROP TABLE "project_members"`);
    await queryRunner.query(`DROP TABLE "projects"`);
    await queryRunner.query(`DROP TABLE "api_keys"`);
    await queryRunner.query(`DROP TABLE "sessions"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
