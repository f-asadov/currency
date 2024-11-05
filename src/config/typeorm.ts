
import * as dotenv from 'dotenv';
import { User } from '../entities/user.entity';
import { Currency } from '../entities/currency.entity';
import { DataSource } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

dotenv.config();

export const dbConfig: MysqlConnectionOptions = {
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [Currency, User],
    migrations: ['dist/src/migrations/*.js'],
    synchronize: false,
    migrationsRun:true

};

const dataSource = new DataSource(dbConfig);
export default dataSource;
