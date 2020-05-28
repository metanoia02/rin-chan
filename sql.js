const SQLite = require('better-sqlite3');
const sql = new SQLite('./orange.sqlite');

module.exports = {
	init() {
		this.setTries = sql.prepare('UPDATE user SET tries = 3');
		this.queryUser = sql.prepare('SELECT * FROM user WHERE user = ? AND guild = ?');
		this.setUser = sql.prepare(
			'INSERT OR REPLACE INTO user (id, user, guild, affection, tries, lastGive) VALUES (@id, @user, @guild, @affection, @tries, @lastGive);'
		);
		this.getAllUsers = sql.prepare('SELECT * FROM user');

		this.queryInventory = sql.prepare('SELECT * FROM inventory WHERE userId = ? AND objectName = ?');
		this.setInventory = sql.prepare(
			'REPLACE INTO inventory(userId, objectName, quantity, lastGet, id) VALUES (@userId, @objectName, @quantity, @lastGet, @id);'
		);

		this.showInventory = sql.prepare('SELECT * FROM inventory WHERE userId = ?');

		this.orangeLeaderboard = sql.prepare('SELECT * FROM inventory WHERE objectName = "orange"');

		this.getObject = sql.prepare('SELECT * FROM object WHERE name = ?');

		this.setTries.run();
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
			};
		}
		return user;
	},

	getInventory(user, object) {
		let objectType = this.getObject.get(object);

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
