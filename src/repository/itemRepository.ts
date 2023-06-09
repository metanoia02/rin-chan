import { Item } from "../entity/Item";
import { AppDataSource } from "../data-source";

export const itemRepository = AppDataSource.getRepository(Item).extend({
});