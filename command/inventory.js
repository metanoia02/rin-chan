module.exports = {
	init() {},

	showInventory(message, command) {
		let user = rinchanSQL.getUser(message.author.id, message.guild.id);
		let inventory = rinchanSQL.showInventory.all(user.id);

		let output = 'Sure, you currently have\n';

		for (var obj in inventory) {
			output += inventory[obj].objectName + ': ' + inventory[obj].quantity + '\n';
		}

		message.channel.send(output);
	},
};
