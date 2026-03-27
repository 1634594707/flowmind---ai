import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

/**
 * Migration to create Session entity and update User entity
 * Adds isActive and lastLoginAt fields to users table
 * Creates sessions table for JWT token management
 * Requirements: 9.1, 9.4
 */
export class CreateSessionAndUpdateUser1704067200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add new columns to users table
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN IF NOT EXISTS "isActive" boolean NOT NULL DEFAULT true,
      ADD COLUMN IF NOT EXISTS "lastLoginAt" timestamp NULL
    `);

    // Create sessions table
    await queryRunner.createTable(
      new Table({
        name: 'sessions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'userId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'token',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'expiresAt',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    // Create index on userId for faster lookups
    await queryRunner.createIndex(
      'sessions',
      new TableIndex({
        name: 'IDX_sessions_userId',
        columnNames: ['userId'],
      }),
    );

    // Create index on token for faster lookups
    await queryRunner.createIndex(
      'sessions',
      new TableIndex({
        name: 'IDX_sessions_token',
        columnNames: ['token'],
      }),
    );

    // Create foreign key constraint
    await queryRunner.createForeignKey(
      'sessions',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop sessions table (foreign key and indexes will be dropped automatically)
    await queryRunner.dropTable('sessions', true);

    // Remove columns from users table
    await queryRunner.query(`
      ALTER TABLE "users"
      DROP COLUMN IF EXISTS "isActive",
      DROP COLUMN IF EXISTS "lastLoginAt"
    `);
  }
}
