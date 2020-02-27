var help = {
    config: require("./config.json"),

    commandList: "",

    init: function() {
        var mainConfig = require("../../config.json");
        var configs = {};

        mainConfig.modules.forEach(function(value) {
            configs[value] = require(`../${value}/config.json`);
        });

        for (var k in configs) {
            if (configs.hasOwnProperty(k)) {
            for (var i = 0; i < configs[k].cmd.length; i++) {
                help.commandList = help.commandList.concat(`**${configs[k].description[i]} Keywords:**\n`);

                for (var v = 0; v < configs[k].cmd[i].length; v++) {
                    help.commandList = help.commandList.concat(`${configs[k].cmd[i][v]}\n`);
                }

                help.commandList = help.commandList.concat("\n");
                }
            }
        }
    },
    
    help: function(message) {
        message.channel.send(help.commandList);
    }
};

module.exports = help