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
				for (var i = 0; i < configs[k].cmd.length; i++) {
					help.commandList += '**' + configs[k].description[i] + ' Keywords:**\n';

					for (var v = 0; v < configs[k].cmd[i].length; v++) {
						help.commandList += configs[k].cmd[i][v] + '\n';
					}

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
