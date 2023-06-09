import { Shop } from "../entity/Shop";
import { AppDataSource } from "../data-source";

export const shopRepository = AppDataSource.getRepository(Shop).extend({
});