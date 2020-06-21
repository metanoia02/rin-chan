const Discord = require('discord.js');

module.exports = class CommandException {
    constructor(command,message, emote = 'rinyabai.png') {
        this.message = message;
        this.emote = emote;
        this.command = command;
    }

    getEmbed() {
        const attachment = new Discord.MessageAttachment(`./images/emotes/${this.emote}`, this.emote);

        return new Discord.MessageEmbed()
            .setColor('#008000')
            .setTitle(this.command)
            .setDescription(this.message)
            .attachFiles(attachment)
            .setThumbnail(`attachment://${this.emote}`);
    }
};