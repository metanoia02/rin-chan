import "reflect-metadata";
import { DataSource } from "typeorm";

import tokens from "./tokens.json";
import { User } from "./entity/User";
import { Currency } from "./entity/Currency";
import { ItemAlts } from "./entity/ItemAlts";
import { Shop } from "./entity/Shop";
import { Item } from "./entity/Item";
import { UserInventoryItem } from "./entity/UserInventoryItem";
import { UserSongBookItem } from "./entity/UserSongBookItem";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "192.168.3.239",
    port: 5432,
    username: "postgres",
    password: tokens.postgresPassword,
    database: "rinbot",
    synchronize: true,
    logging: false,
    entities: [User, Currency, ItemAlts, Shop, Item, UserInventoryItem, UserSongBookItem],
    migrations: [],
    subscribers: [],
});
