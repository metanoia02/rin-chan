const SQLite = require('better-sqlite3');
const sql = new SQLite('./orange.sqlite');
const CommandException = require('../utils/CommandException.js');
const Entity = require('./Entity');

module.exports = {
  init() {
    this.queryUser = sql.prepare('SELECT * FROM user WHERE user = ? AND guild = ?');
    this.setUser = sql.prepare(
      'INSERT OR REPLACE INTO user (id, user, guild, affection, tries, lastGive, lastSteal, lastHarvest, isBooster, carrotsGiven, xp) VALUES (@id, @user, @guild, @affection, @tries, @lastGive, @lastSteal, @lastHarvest, @isBooster, @carrotsGiven, @xp);'
    );
    this.getAllUsers = sql.prepare('SELECT * FROM user');

    //inventory
    this.queryInventory = sql.prepare('SELECT * FROM inventory WHERE userId = ? AND entityId = ?');
    this.setInventory = sql.prepare(
      'REPLACE INTO inventory(userId, entityId, quantity, lastGet, id) VALUES (@userId, @entityId, @quantity, @lastGet, @id);'
    );
    this.showInventory = sql.prepare('SELECT * FROM inventory WHERE userId = ?');

    //songBook Inventory
    this.querySongBookInventory = sql.prepare('SELECT * FROM songBookInventory WHERE userId = ? AND entityId = ?');
    this.addSongInventory = sql.prepare(
      'INSERT INTO songBookInventory(userId, entityId, id) VALUES (@userId, @entityId, @id);'
    );
    this.removeSongInventory = sql.prepare('DELETE FROM songBookInventory WHERE userId = ? AND entityId = ?');
    this.showSongBookInventory = sql.prepare('SELECT * FROM inventory WHERE userId = ?');
    this.getSongBook = sql.prepare('SELECT * FROM songBookInventory WHERE userId = ?');

    this.entityLeaderboard = sql.prepare('SELECT * FROM inventory WHERE entityId = ?');

    this.queryEntity = sql.prepare('SELECT * FROM entity WHERE id = ?');
    this.getAllEntitys = sql.prepare('SELECT * FROM entity');

    // shop
    this.queryShop = sql.prepare('SELECT * FROM shop WHERE entityId = ?');
    this.setShopStock = sql.prepare('REPLACE INTO shop (entityId, quantity) VALUES (@entityId, @quantity);');

    this.queryStock = sql.prepare('SELECT * FROM shop');

    this.getShops = sql.prepare('SELECT * FROM shopLayout');

    // affection
    this.getTopAffection = sql.prepare('SELECT user FROM user ORDER BY affection DESC');

    // entity
    this.queryEntities = sql.prepare('SELECT * FROM entity');

    this.queryAlts = sql.prepare('SELECT * FROM entityAlts');
    this.queryFeedable = sql.prepare('SELECT * FROM entityFeedable');
    this.querySearchable = sql.prepare('SELECT * FROM entitySearchable');
    this.queryTradable = sql.prepare('SELECT * FROM entityTradable');
    this.querySingable = sql.prepare('SELECT * FROM entitySingable');

    this.queryEntityCurrency = sql.prepare('SELECT * FROM entityTradable WHERE entityId = ?');

    this.queryEquipped = sql.prepare('SELECT * FROM equippedEntity WHERE userId = ?');
    this.setEquipped = sql.prepare(
      'INSERT OR REPLACE INTO equippedEntity (userId, entityId) VALUES (@userId, @entityId);');
  },

  close() {
    sql.close();
  },

  getAllShopStock(currencyEntityId) {
    const stock = this.queryStock.all();

    return stock.reduce((acc, ele) => {
      const entity = this.queryEntity.get(ele.entityId);

      if (this.queryEntityCurrency.get(ele.entityId) == currencyEntityId) {
        acc.push({id: ele.entityId, name: entity.name, quantity: ele.quantity});
        return acc;
      }
    }, []);
  },

  getUser(userId, guildId) {
    let user = this.queryUser.get(userId, guildId);

    if (!user) {
      user = {
        id: `${guildId}-${userId}`,
        user: userId,
        guild: guildId,
        affection: 0,
        tries: 3,
        lastGive: 0,
        lastSteal: 0,
        lastHarvest: 0,
        isBooster: 0,
        carrotsGiven: 0,
        xp: 0,
      };
    }
    return user;
  },

  getInventoryEntity(user, entityId) {
    if (this.queryEntity.get(entityId)) {
      let inventory = this.queryInventory.get(user.id, entityId);

      if (!inventory) {
        inventory = {
          userId: user.id,
          entityId: entityId,
          quantity: 0,
          lastGet: 0,
          id: `${user.id}-${entityId}`,
        };
      }

      return inventory;
    } else {
      return undefined;
    }
  },

  addSong(userId, entityId) {
    if (this.queryEntity.get(entityId)) {
      let inventory = this.querySongBookInventory.get(userId, entityId);

      if (!inventory) {
        inventory = {
          userId: userId,
          entityId: entityId,
          id: `${userId}-${entityId}`,
        };
      } else {
        throw new Error('Tried to add song that already exists in inventory');
      }

      this.addSongInventory.run(inventory);
    }
  },

  removeSong(userId, entityId) {
    let inventory = this.querySongBookInventory.get(userId, entityId);

    if(!inventory) {
      throw new Error('Tried to remove song that doesnt exist in inventory');
    } else {
      this.removeSongInventory.run(userId, entityId);
    }
  },

  getShopStock(entityId) {
    if (this.queryEntity.get(entityId)) {
      let shop = this.queryShop.get(entityId);

      if (!shop) {
        shop = {
          entityId: entityId,
          quantity: 0,
        };
      }

      return shop;
    } else {
      throw new CommandException('What is that?', 'rinwha.png');
    }
  },

  getEntities() {
    const entities = this.queryEntities.all();

    const alts = this.queryAlts.all();
    const feedable = this.queryFeedable.all();
    const searchable = this.querySearchable.all();
    const tradable = this.queryTradable.all();
    const singable = this.querySingable.all();

    return entities.reduce((acc, ele) => {
      acc.push(
        new Entity(
          ele,
          alts.filter((alt) => alt.entityId === ele.id),
          feedable.find((food) => food.entityId === ele.id),
          searchable.find((search) => search.entityId === ele.id),
          tradable.find((trade) => trade.entityId === ele.id),
          singable.find((song) => song.entityId === ele.id)
        )
      );
      return acc;
    }, []);
  }
};
