const Discord = require('discord.js');

module.exports = class CommandException {
    constructor(message, emote = 'rinyabai.png') {
        this.message = message;
        this.emote = emote;
    };

    getEmbed(commandName) {
        const attachment = new Discord.MessageAttachment(`./images/emotes/${this.emote}`, this.emote);

        return new Discord.MessageEmbed()
            .setColor('#008000')
            .setTitle(commandName)
            .setDescription(this.message)
            .attachFiles(attachment)
            .setThumbnail(`attachment://${this.emote}`);
    };
};