import "reflect-metadata";
import { DataSource } from "typeorm";

import tokens from "./tokens.json";
import { User } from "./entity/User";
import { Item } from "./entity/Item";
import { InventoryStack } from "./entity/InventoryStack";
import { Shop } from "./entity/Shop";
import { ItemAlts } from "./entity/ItemAlts";
import { Currency } from "./entity/Currency";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "192.168.3.239",
    port: 5432,
    username: "postgres",
    password: tokens.postgresPassword,
    database: "rinbot",
    synchronize: true,
    logging: false,
    entities: [User, Item, InventoryStack, Shop, ItemAlts, Currency],
    migrations: [],
    subscribers: [],
});
