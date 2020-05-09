module.exports = {
	commandList: '',

	init() {
		const configs = require('../config.js');

		for (let k in configs) {
			if (configs.hasOwnProperty(k)) {
				let x = 0;
				for (let c in configs[k].cmd) {
					help.commandList += '**' + configs[k].description[x] + ' Keywords:**\n';

					for (let v = 0; v < configs[k].cmd[c].length; v++) {
						help.commandList += configs[k].cmd[c][v] + '\n';
					}
					x++;

					help.commandList += '\n';
				}
			}
		}
	},

	help(message) {
		message.channel.send(help.commandList);
	},
};
