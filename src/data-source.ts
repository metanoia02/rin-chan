import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'orange.db3',
  synchronize: true,
  logging: false,
  entities: ['src/entity/*{.js,.ts}'],
  migrations: [],
  subscribers: [],
});
