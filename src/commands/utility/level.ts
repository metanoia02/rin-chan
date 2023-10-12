import { ICommand } from '../../interfaces/ICommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import { AttachmentBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { User } from '../../entity/User';
import { config } from '../../config';
import { LevelContent } from '../../types/LevelContent';
import { generateImage } from '../../util/generateImage';

export const level: ICommand = {
  data: new SlashCommandBuilder().setName('level').setDescription('Show your current level.'),
  async execute(interaction: ChatInputCommandInteraction) {
    const user = await User.get(interaction.user.id, interaction.guildId!);
    let content: LevelContent;

    const currentLevelIndex = config.levels.indexOf(user.getLevel());
    const nextLevel = config.levels[currentLevelIndex - 1 ?? currentLevelIndex];

    if (nextLevel) {
      const barColour = interaction.guild!.roles.cache.find(
        (role) => role.name === user.getLevel().name,
      )?.hexColor;

      const levelName = `Next Level: ${nextLevel.name}`;
      const percentageFill = Math.floor(
        ((user.xp - config.levels[currentLevelIndex].xp) /
          (nextLevel.xp - config.levels[currentLevelIndex].xp)) *
          100,
      );

      content = {
        barColour: barColour ?? '#FFA500',
        levelName: levelName,
        percentageFill: percentageFill,
        currentXp: user.xp,
        targetXp: nextLevel.xp,
      };
    } else {
      content = { barColour: '#D4AF37', levelName: 'Max Level', percentageFill: 100 };
    }

    const image = await generateImage('./src/templates/level.html', content, 100);

    const attachment = new AttachmentBuilder(image, { name: 'level.jpg' });
    const leaderboardEmbed = new EmbedBuilder()
      .setColor('#0099ff')
      .setImage('attachment://level.jpg');

    interaction.reply({ embeds: [leaderboardEmbed], files: [attachment] });
  },
};
