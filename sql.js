const SQLite = require('better-sqlite3');
const sql = new SQLite('./orange.sqlite');

module.exports = {
	init() {
		const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'orange';").get();

		if (!table['count(*)']) {
			sql
				.prepare(
					'CREATE TABLE orange (id TEXT PRIMARY KEY, user TEXT, guild TEXT, oranges INTEGER, affection INTEGER, tries INTEGER, lastTry INTEGER);'
				)
				.run();

			sql.prepare('CREATE UNIQUE INDEX idx_orange_id ON orange (id);').run();
			sql.pragma('synchronous = 1');
			sql.pragma('journal_mode = wal');
		}

		this.setTries = sql.prepare('UPDATE orange SET tries = 3');
		this.getOrange = sql.prepare('SELECT * FROM orange WHERE user = ? AND guild = ?');
		this.setOrange = sql.prepare(
			'INSERT OR REPLACE INTO orange (id, user, guild, oranges, affection, tries, lastTry) VALUES (@id, @user, @guild, @oranges, @affection, @tries, @lastTry);'
		);
		this.getBoard = sql.prepare('SELECT * FROM orange');

		this.setTries.run();
	},

	getUser(userId, guildId) {
		let user = this.getOrange.get(userId, guildId);

		if (!user) {
			user = {
				id: `${guildId}-${userId}`,
				user: userId,
				guild: guildId,
				oranges: 0,
				affection: 0,
				tries: 3,
				lastTry: 0,
			};
		}
		return user;
	},

	setOranges(userId, guildId, quantity = 0) {
		let user = getUser(userId, guildId);
	},
};
