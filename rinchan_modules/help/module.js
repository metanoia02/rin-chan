const help = {
	config: require('./config.json'),

	commandList: '',

	init() {
		const mainConfig = require('../../config.json');
		let configs = {};

		mainConfig.modules.forEach(function(value) {
			configs[value] = require(`../${value}/config.json`);
		});

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

module.exports = help;
