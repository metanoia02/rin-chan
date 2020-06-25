module.exports = {
	init() {},

	showInventory(message, command) {
		let user = rinchanSQL.getUser(message.author.id, message.guild.id);
		let inventory = rinchanSQL.showInventory.all(user.id);

		let output = 'Sure, you currently have\n';

		for (var obj in inventory) {
			if (inventory[obj].quantity > 0) {
				output += capitalizeFirstLetter(inventory[obj].objectName) + ': ' + inventory[obj].quantity + '\n';
			}
		}

		if (output === 'Sure, you currently have\n') {
			output = 'Your inventory is empty.';
		}

		message.channel.send(output);
	},
};
