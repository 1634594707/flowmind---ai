import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRbacSchema1711000000000 implements MigrationInterface {
  name = 'AddRbacSchema1711000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "roles" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "code" varchar(80) NOT NULL UNIQUE,
        "name" varchar(120) NOT NULL,
        "system" boolean NOT NULL DEFAULT false,
        "created_at" timestamp NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "permissions" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "code" varchar(120) NOT NULL UNIQUE,
        "name" varchar(255) NOT NULL,
        "description" text,
        "created_at" timestamp NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "role_permissions" (
        "role_id" uuid NOT NULL REFERENCES "roles"("id") ON DELETE CASCADE,
        "permission_id" uuid NOT NULL REFERENCES "permissions"("id") ON DELETE CASCADE,
        PRIMARY KEY ("role_id", "permission_id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "user_roles" (
        "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "role_id" uuid NOT NULL REFERENCES "roles"("id") ON DELETE CASCADE,
        PRIMARY KEY ("user_id", "role_id")
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "idx_role_permissions_role_id" ON "role_permissions"("role_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_role_permissions_permission_id" ON "role_permissions"("permission_id")`,
    );
    await queryRunner.query(`CREATE INDEX "idx_user_roles_user_id" ON "user_roles"("user_id")`);
    await queryRunner.query(`CREATE INDEX "idx_user_roles_role_id" ON "user_roles"("role_id")`);

    await queryRunner.query(`
      INSERT INTO "roles" ("code", "name", "system") VALUES
      ('admin', 'Admin', true),
      ('project_manager', 'Project Manager', true),
      ('developer', 'Developer', true),
      ('viewer', 'Viewer', true)
      ON CONFLICT ("code") DO NOTHING
    `);

    await queryRunner.query(`
      INSERT INTO "permissions" ("code", "name") VALUES
      ('project.read', 'Read project'),
      ('project.update', 'Update project'),
      ('project.member.manage', 'Manage project members'),
      ('task.create', 'Create task'),
      ('task.read', 'Read task'),
      ('task.update', 'Update task'),
      ('task.delete', 'Delete task'),
      ('document.create', 'Create document'),
      ('document.read', 'Read document'),
      ('document.update', 'Update document')
      ON CONFLICT ("code") DO NOTHING
    `);

    await queryRunner.query(`
      INSERT INTO "role_permissions" ("role_id", "permission_id")
      SELECT r.id, p.id
      FROM "roles" r
      JOIN "permissions" p ON p.code IN (
        'project.read', 'project.update', 'project.member.manage',
        'task.create', 'task.read', 'task.update', 'task.delete',
        'document.create', 'document.read', 'document.update'
      )
      WHERE r.code = 'project_manager'
      ON CONFLICT DO NOTHING
    `);

    await queryRunner.query(`
      INSERT INTO "role_permissions" ("role_id", "permission_id")
      SELECT r.id, p.id
      FROM "roles" r
      JOIN "permissions" p ON p.code IN (
        'project.read',
        'task.create', 'task.read', 'task.update',
        'document.read', 'document.update'
      )
      WHERE r.code = 'developer'
      ON CONFLICT DO NOTHING
    `);

    await queryRunner.query(`
      INSERT INTO "role_permissions" ("role_id", "permission_id")
      SELECT r.id, p.id
      FROM "roles" r
      JOIN "permissions" p ON p.code IN ('project.read', 'task.read', 'document.read')
      WHERE r.code = 'viewer'
      ON CONFLICT DO NOTHING
    `);

    await queryRunner.query(`
      INSERT INTO "user_roles" ("user_id", "role_id")
      SELECT u.id, r.id
      FROM "users" u
      JOIN "roles" r ON r.code = u.role
      ON CONFLICT DO NOTHING
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "idx_user_roles_role_id"`);
    await queryRunner.query(`DROP INDEX "idx_user_roles_user_id"`);
    await queryRunner.query(`DROP INDEX "idx_role_permissions_permission_id"`);
    await queryRunner.query(`DROP INDEX "idx_role_permissions_role_id"`);
    await queryRunner.query(`DROP TABLE "user_roles"`);
    await queryRunner.query(`DROP TABLE "role_permissions"`);
    await queryRunner.query(`DROP TABLE "permissions"`);
    await queryRunner.query(`DROP TABLE "roles"`);
  }
}
