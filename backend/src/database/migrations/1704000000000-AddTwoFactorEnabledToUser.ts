import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddTwoFactorEnabledToUser1704000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'two_factor_enabled',
        type: 'boolean',
        default: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'two_factor_enabled');
  }
}
