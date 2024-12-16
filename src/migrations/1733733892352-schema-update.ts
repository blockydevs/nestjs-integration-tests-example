import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1733733892352 implements MigrationInterface {
    name = 'SchemaUpdate1733733892352'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer" RENAME COLUMN "customer_id" TO "external_id"`);
        await queryRunner.query(`ALTER TABLE "customer" RENAME CONSTRAINT "UQ_cde3d123fc6077bcd75eb051226" TO "UQ_14d3cd6e93b252be097b22f9811"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "date_completed"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "total_value"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "total_value" bigint NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "total_value"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "total_value" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ADD "date_completed" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "customer" RENAME CONSTRAINT "UQ_14d3cd6e93b252be097b22f9811" TO "UQ_cde3d123fc6077bcd75eb051226"`);
        await queryRunner.query(`ALTER TABLE "customer" RENAME COLUMN "external_id" TO "customer_id"`);
    }

}
