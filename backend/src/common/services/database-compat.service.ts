import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseCompatService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseCompatService.name);

  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit(): Promise<void> {
    await this.ensureUsersCompatibilityColumns();
    await this.ensureSessionsTable();
    await this.ensureAuditLogsTable();
  }

  private async ensureUsersCompatibilityColumns(): Promise<void> {
    await this.dataSource.query(`
      ALTER TABLE "users"
      ADD COLUMN IF NOT EXISTS "password_hash" varchar(255)
    `);
    await this.dataSource.query(`
      ALTER TABLE "users"
      ADD COLUMN IF NOT EXISTS "totp_secret" varchar(255)
    `);
    await this.dataSource.query(`
      ALTER TABLE "users"
      ADD COLUMN IF NOT EXISTS "two_factor_enabled" boolean NOT NULL DEFAULT false
    `);
    await this.dataSource.query(`
      ALTER TABLE "users"
      ADD COLUMN IF NOT EXISTS "is_active" boolean NOT NULL DEFAULT true
    `);
    await this.dataSource.query(`
      ALTER TABLE "users"
      ADD COLUMN IF NOT EXISTS "last_login_at" timestamp NULL
    `);
    await this.dataSource.query(`
      ALTER TABLE "users"
      ADD COLUMN IF NOT EXISTS "created_at" timestamp NOT NULL DEFAULT now()
    `);
    await this.dataSource.query(`
      ALTER TABLE "users"
      ADD COLUMN IF NOT EXISTS "updated_at" timestamp NOT NULL DEFAULT now()
    `);

    await this.dataSource.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'users'
            AND column_name = 'password'
        ) THEN
          UPDATE "users"
          SET "password_hash" = "password"
          WHERE "password_hash" IS NULL AND "password" IS NOT NULL;
        END IF;

        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'users'
            AND column_name = 'twoFactorSecret'
        ) THEN
          UPDATE "users"
          SET "totp_secret" = "twoFactorSecret"
          WHERE "totp_secret" IS NULL AND "twoFactorSecret" IS NOT NULL;
        END IF;

        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'users'
            AND column_name = 'twoFactorEnabled'
        ) THEN
          UPDATE "users"
          SET "two_factor_enabled" = COALESCE("twoFactorEnabled", false)
          WHERE "two_factor_enabled" IS NULL;
        END IF;

        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'users'
            AND column_name = 'isActive'
        ) THEN
          UPDATE "users"
          SET "is_active" = COALESCE("isActive", true)
          WHERE "is_active" IS NULL;
        END IF;

        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'users'
            AND column_name = 'lastLoginAt'
        ) THEN
          UPDATE "users"
          SET "last_login_at" = "lastLoginAt"
          WHERE "last_login_at" IS NULL AND "lastLoginAt" IS NOT NULL;
        END IF;

        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'users'
            AND column_name = 'createdAt'
        ) THEN
          UPDATE "users"
          SET "created_at" = "createdAt"
          WHERE "created_at" IS NULL AND "createdAt" IS NOT NULL;
        END IF;

        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'users'
            AND column_name = 'updatedAt'
        ) THEN
          UPDATE "users"
          SET "updated_at" = "updatedAt"
          WHERE "updated_at" IS NULL AND "updatedAt" IS NOT NULL;
        END IF;
      END
      $$;
    `);

    this.logger.log('Database compatibility check completed for users columns');
  }

  private async ensureAuditLogsTable(): Promise<void> {
    await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS "audit_logs" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "user_id" varchar,
        "email" varchar,
        "event_type" varchar NOT NULL,
        "action" varchar NOT NULL,
        "status" varchar NOT NULL,
        "ip_address" varchar,
        "user_agent" varchar,
        "metadata" jsonb,
        "error_message" varchar,
        "created_at" timestamp NOT NULL DEFAULT now()
      )
    `);

    await this.dataSource.query(`
      CREATE INDEX IF NOT EXISTS "IDX_2f68e345c05e8166ff9deea1ab"
      ON "audit_logs" ("user_id", "created_at")
    `);

    await this.dataSource.query(`
      CREATE INDEX IF NOT EXISTS "IDX_9de109d600789891986c6d74a9"
      ON "audit_logs" ("event_type", "created_at")
    `);

    this.logger.log('Database compatibility check completed for audit_logs table');
  }

  private async ensureSessionsTable(): Promise<void> {
    await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS "sessions" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "token" varchar(500) NOT NULL UNIQUE,
        "expires_at" timestamp NOT NULL,
        "created_at" timestamp NOT NULL DEFAULT now()
      )
    `);

    await this.dataSource.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM information_schema.table_constraints
          WHERE table_schema = 'public'
            AND table_name = 'sessions'
            AND constraint_type = 'FOREIGN KEY'
            AND constraint_name = 'FK_sessions_user_id_users_id'
        ) THEN
          ALTER TABLE "sessions"
          ADD CONSTRAINT "FK_sessions_user_id_users_id"
          FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;
        END IF;
      END
      $$;
    `);

    await this.dataSource.query(`
      CREATE INDEX IF NOT EXISTS "idx_sessions_user_id"
      ON "sessions" ("user_id")
    `);
    await this.dataSource.query(`
      CREATE INDEX IF NOT EXISTS "idx_sessions_token"
      ON "sessions" ("token")
    `);

    this.logger.log('Database compatibility check completed for sessions table');
  }
}
