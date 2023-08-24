import { ICommand } from '../../interfaces/ICommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction, Message } from 'discord.js';
import { User } from 'src/entity/User';
import { commandEmbed } from 'src/util/commands';
import { RinChan } from 'src/entity/RinChan';
import arrayRandom from 'src/util/arrayRandom';

const responses = [
  'It is certain',
  'Without a doubt',
  'You may rely on it',
  'Yes definitely',
  'It is decidedly so',
  'As I see it, yes',
  'Most likely',
  'Yes',
  'Outlook good',
  'Signs point to yes',
  'Reply hazy try again',
  'Better not tell you now',
  'Ask again later',
  'Cannot predict now',
  'Concentrate and ask again',
  `Don't count on it`,
  'Outlook not so good',
  'My sources say no',
  'Very doubtful',
  'My reply is no',
];

const price = 3;

export const predict: ICommand = {
  data: new SlashCommandBuilder()
    .setName('predict')
    .setDescription('Ask Rin-chan to make a prediction about something.'),

  async execute(interaction: ChatInputCommandInteraction) {
    const filter = (response:Message) => {
      return response.author.id === interaction.user.id;
    };

    if (interaction.channel) {
      await interaction.reply(
        `You may seek my wisdom for a small fee of ${price} oranges. If that's okay ask your question now:`,
      );

      const collector = interaction.channel.createMessageCollector({filter: filter, time: 30000);

        collector.on('collect', (message) => {
          const user = await User.get(message.author.id, message.guildId!);
          if (await user.getQuantity('orange') < price) {
            interaction.followUp(commandEmbed(`You don't have enough oranges.`, 'rinpls.png'));
          }

          const rinChan = await RinChan.get(message.guildId!);
          user.setQuantity('orange', (await user.getQuantity('orange')) - price);
          const rinchan = await User.get(rinChan.id, message.guildId!);
          rinchan.setQuantity('orange', (await rinchan.getQuantity('orange')) + price);

          interaction.followUp(arrayRandom(responses));
        });

        collector.on('end', (() => {
          interaction.followUp('Another time perhaps');
        }));
    }
  },
};
