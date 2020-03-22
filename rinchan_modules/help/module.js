var help = {
	config: require('./config.json'),

	commandList: '',

	init() {
		var mainConfig = require('../../config.json');
		var configs = {};

		mainConfig.modules.forEach(function(value) {
			configs[value] = require(`../${value}/config.json`);
		});

		for (var k in configs) {
			if (configs.hasOwnProperty(k)) {
				var x = 0;
				for (var c in configs[k].cmd) {
					help.commandList += '**' + configs[k].description[x] + ' Keywords:**\n';

					for (var v = 0; v < configs[k].cmd[c].length; v++) {
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
