import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1730280951995 implements MigrationInterface {
    name = 'InitialMigration1730280951995'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`username\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`currencies\` (\`id\` int NOT NULL AUTO_INCREMENT, \`charCode\` varchar(10) NOT NULL, \`name\` varchar(255) NOT NULL, \`nominal\` int NOT NULL, \`currencyId\` varchar(50) NOT NULL, \`history\` json NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`currencies\``);
        await queryRunner.query(`DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }

}
