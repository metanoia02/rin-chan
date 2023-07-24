import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { User } from './entity/User';
import { Item } from './entity/Item';
import { InventoryStack } from './entity/InventoryStack';
import { Shop } from './entity/Shop';
import { ItemAlts } from './entity/ItemAlts';
import { Currency } from './entity/Currency';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'orange.db3',
  synchronize: true,
  logging: false,
  entities: [User, Item, InventoryStack, Shop, ItemAlts, Currency],
  migrations: [],
  subscribers: [],
});
