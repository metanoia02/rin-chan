const SQLite = require('better-sqlite3');
const sql = new SQLite('./orange.sqlite');
const CommandException = require('../utils/CommandException.js');

module.exports = {
	init() {
		this.queryUser = sql.prepare('SELECT * FROM user WHERE user = ? AND guild = ?');
		this.setUser = sql.prepare(
			'INSERT OR REPLACE INTO user (id, user, guild, affection, tries, lastGive, lastSteal, lastHarvest, isBooster, carrotsGiven) VALUES (@id, @user, @guild, @affection, @tries, @lastGive, @lastSteal, @lastHarvest, @isBooster, @carrotsGiven);'
		);
		this.getAllUsers = sql.prepare('SELECT * FROM user');

		this.queryInventory = sql.prepare('SELECT * FROM inventory WHERE userId = ? AND objectName = ?');
		this.setInventory = sql.prepare(
			'REPLACE INTO inventory(userId, objectName, quantity, lastGet, id) VALUES (@userId, @objectName, @quantity, @lastGet, @id);'
		);

		this.showInventory = sql.prepare('SELECT * FROM inventory WHERE userId = ?');

		this.objectLeaderboard = sql.prepare('SELECT * FROM inventory WHERE objectName LIKE ?');

		this.queryObject = sql.prepare('SELECT * FROM object WHERE name LIKE ? OR plural LIKE ?');
		this.getAllObjects = sql.prepare('SELECT * FROM object');
		
		//shop
		this.queryShop = sql.prepare('SELECT * FROM shop WHERE objectName LIKE ?');
		this.setShopStock = sql.prepare('REPLACE INTO shop (objectName, quantity) VALUES (@objectName, @quantity);'); 

		this.getStock = sql.prepare('SELECT * FROM shop');
	},

	getObject(objectString) {
		let object = rinchanSQL.queryObject.get(objectString,objectString);

		if(!object) {
			throw new CommandException('What is that?','rinwha.png');
		}
		return object;
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
				carrotsGiven: 0
			};
		}
		return user;
	},

	getInventory(user, object) {
		let objectType = this.queryObject.get(object,object);

		if (objectType) {
			let inventory = this.queryInventory.get(user.id, object);

			if (!inventory) {
				inventory = {
					userId: user.id,
					objectName: object,
					quantity: 0,
					lastGet: 0,
					id: `${user.id}-${object}`,
				};
			}

			return inventory;
		} else {
			return undefined;
		}
	},

	getShopStock(object) {
		let objectType = this.queryObject.get(object,object);

		if (objectType) {
			let shop = this.queryShop.get(object);

			if (!shop) {
				shop = {
					objectName:	object,
					quantity: 0
				};
			}

			return shop;
		} else {
			throw new CommandException('What is that?','rinwha.png');
		}
	}
};
