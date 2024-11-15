import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaUpdate1731668946986 implements MigrationInterface {
  name = 'SchemaUpdate1731668946986';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "customer"
                             (
                                 "id"          uuid              NOT NULL DEFAULT uuid_generate_v4(),
                                 "customer_id" character varying NOT NULL,
                                 CONSTRAINT "UQ_cde3d123fc6077bcd75eb051226" UNIQUE ("customer_id"),
                                 CONSTRAINT "PK_a7a13f4cacb744524e44dfdad32" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`CREATE TABLE "order"
                             (
                                 "id"             uuid              NOT NULL DEFAULT uuid_generate_v4(),
                                 "cart_id"        character varying NOT NULL,
                                 "date_completed" TIMESTAMP         NOT NULL DEFAULT now(),
                                 "total_value"    double precision  NOT NULL,
                                 "customer_id"    uuid,
                                 CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`ALTER TABLE "order"
        ADD CONSTRAINT "FK_cd7812c96209c5bdd48a6b858b0" FOREIGN KEY ("customer_id") REFERENCES "customer" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_cd7812c96209c5bdd48a6b858b0"`,
    );
    await queryRunner.query(`DROP TABLE "order"`);
    await queryRunner.query(`DROP TABLE "customer"`);
  }
}
