import 'dotenv/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const { MYSQL_USER_NAME, MYSQL_ROOT_PASSWORD, MYSQL_DB_NAME, MYSQL_HOST } =
  process.env;

export const ORMConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  username: MYSQL_USER_NAME,
  password: MYSQL_ROOT_PASSWORD,
  port: 3306,
  host: MYSQL_HOST,
  database: MYSQL_DB_NAME,
  autoLoadEntities: true,
  logging: true,
  entities: ['dist/**/*.entity{ .ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  migrationsRun: true,
  synchronize: true,
};
