const Booru = require('booru');
const Discord = require('discord.js');

module.exports = {
  rinImage(message) {
    Booru.search('safebooru', ['kagamine_rin+solo'], {limit: 1, random: true}).then((posts) => {
      for (const post of posts) {
        const attachment = new Discord.MessageAttachment('./images/safebooru.png', 'safebooru.png');
        const giveHeadpatEmbed = new Discord.MessageEmbed()
            .setColor('#008000')
            .setTitle('Kagamine Rin')
            .setURL(post.postView)
            .setImage(post.fileUrl)
            .attachFiles(attachment)
            .setFooter(`Safebooru`, `attachment://safebooru.png`);

        message.channel.send(giveHeadpatEmbed).catch(console.error);
      }
    });
  },
};
