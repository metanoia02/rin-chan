module.exports = {
	commandList: '',

	init() {
		const configs = require('../config.js');

		for (let k in configs) {
			if (configs.hasOwnProperty(k)) {
				let x = 0;
				for (let c in configs[k].cmd) {
					this.commandList += '**' + configs[k].description[x] + ' Keywords:**\n';

					for (let v = 0; v < configs[k].cmd[c].length; v++) {
						this.commandList += convertCommand(configs[k].cmd[c][v], false) + '\n';
					}
					x++;

					this.commandList += '\n';
				}
			}
		}

		this.commandList += "**Available objects:**\n";

		let objects = rinchanSQL.getAllObjects.all();

		this.commandList += objects.reduce((acc,ele) => {
			return acc += ele.name + "\n"; 
		}, "");
	},

	help(message) {
		message.author.send(this.commandList);
	},
};