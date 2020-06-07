const SQLite = require('better-sqlite3');
const sql = new SQLite('./orange.sqlite');

module.exports = {
	init() {
		this.setTries = sql.prepare('UPDATE user SET tries = 3');
		this.queryUser = sql.prepare('SELECT * FROM user WHERE user = ? AND guild = ?');
		this.setUser = sql.prepare(
			'INSERT OR REPLACE INTO user (id, user, guild, affection, tries, lastGive, lastSteal) VALUES (@id, @user, @guild, @affection, @tries, @lastGive, @lastSteal);'
		);
		this.getAllUsers = sql.prepare('SELECT * FROM user');

		this.queryInventory = sql.prepare('SELECT * FROM inventory WHERE userId = ? AND objectName = ?');
		this.setInventory = sql.prepare(
			'REPLACE INTO inventory(userId, objectName, quantity, lastGet, id) VALUES (@userId, @objectName, @quantity, @lastGet, @id);'
		);

		this.showInventory = sql.prepare('SELECT * FROM inventory WHERE userId = ?');

		this.orangeLeaderboard = sql.prepare('SELECT * FROM inventory WHERE objectName = "orange"');

		this.queryObject = sql.prepare('SELECT * FROM object WHERE name LIKE ? OR plural LIKE ?');
		this.getAllObjects = sql.prepare('SELECT * FROM object');

		this.setTries.run();
	},

	getObject(objectString) {
		let object = rinchanSQL.queryObject.get(objectString,objectString);

		if(!object) {
			return undefined;
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
};

setInterval(function () {
	module.exports.setTries.run();
}, 7200000);
