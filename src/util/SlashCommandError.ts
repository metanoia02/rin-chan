import { Embed, EmbedBuilder, InteractionReplyOptions, MessageCreateOptions } from 'discord.js';

export class SlashCommandError {
  private message: string;
  private errorClass: any;
  /**
   *
   * @param {string} message Message to display in embed.
   * @param {string} emote Name of emote for embed. Located in ./images/reactions/
   * @param {Discord.channel} channel to send error in
   */
  constructor(message: string, errorClass: any) {
    this.message = message;
    this.errorClass = errorClass;
  }

  /**
   * Returns a Discord embed.
   * @param {string} commandName Command name for title of embed.
   * @return {Discord.MessageEmbed} Embed Entity.
   */
  getEmbed(commandName: string): MessageCreateOptions {
    const commandEmbed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle(commandName)
      .setDescription(this.message)
      .addFields({
        name: this.errorClass.constructor.name,
        value: JSON.stringify(this.errorClass),
      });

    return { embeds: [commandEmbed] };
  }

  toString(commandName: string): string {
    return (
      commandName +
      ': ' +
      this.message +
      '\n' +
      this.errorClass.constructor.name +
      ': ' +
      JSON.stringify(this.errorClass)
    );
  }
}
