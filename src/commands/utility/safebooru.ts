import axios from 'axios';
import { ICommand } from '../../interfaces/ICommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import {
  ChatInputCommandInteraction,
  AutocompleteInteraction,
  ApplicationCommandOptionChoiceData,
  EmbedBuilder,
  MessageReaction,
  User,
  TextChannel,
} from 'discord.js';
import { Item } from '../../entity/Item';
import { IsNull, Not } from 'typeorm';
import { capitalizeFirstLetter, commandEmbed } from '../../util/commands';
import { parseString } from 'xml2js';
import { SlashCommandError } from '../../util/SlashCommandError';
import { Server } from '../../entity/Server';

const tagBlacklist =
  '+-underwear+-rope+-nude+-undressing+-erect_nipples+-no_bra+-fertilization+-naked_coat';
const apiString = 'http://safebooru.org/index.php?page=dapi&s=post&q=index&limit=1';

function randomPost(string: string) {
  return new Promise((resolve, reject) => {
    parseString(string, (err, result) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(Math.floor(Math.random() * result.posts.$.count));
      }
    });
  });
}

export const safebooru: ICommand = {
  data: new SlashCommandBuilder()
    .setName('safebooru')
    .setDescription('Get vocaloid images.')
    .addStringOption((option) =>
      option
        .setName('search1')
        .setDescription('Character/thing to search for')
        .setRequired(true)
        .setAutocomplete(true),
    )
    .addStringOption((option) =>
      option
        .setName('search2')
        .setDescription('Character/thing to search for')
        .setRequired(false)
        .setAutocomplete(true),
    )
    .addStringOption((option) =>
      option
        .setName('search3')
        .setDescription('Character/thing to search for')
        .setRequired(false)
        .setAutocomplete(true),
    )
    .addStringOption((option) =>
      option
        .setName('search4')
        .setDescription('Character/thing to search for')
        .setRequired(false)
        .setAutocomplete(true),
    )
    .addStringOption((option) =>
      option
        .setName('search5')
        .setDescription('Character/thing to search for')
        .setRequired(false)
        .setAutocomplete(true),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const selectedOptions = interaction.options.data.map((option) => option.value!.toString());

    let imageTags = selectedOptions.join('+');

    if (selectedOptions.length === 1) imageTags += '+solo';
    imageTags += tagBlacklist;

    const idResponse = await axios.get(`${apiString}&tags=${imageTags}`);
    const randomId = await randomPost(idResponse.data);
    const image = await axios.get(`${apiString}&pid=${randomId}&tags=${imageTags}&json=1`);

    if (!image.data[0]) {
      interaction.reply(commandEmbed(`Couldn't find any images...`, 'rinded.png'));
    } else {
      let titleString = '';

      for (const index in selectedOptions) {
        const name = (await Item.findOne({ where: { searchTag: selectedOptions[index] } }))?.name;

        if (name) {
          if (parseInt(index) === 0) {
            titleString += `${capitalizeFirstLetter(name)}`;
          } else if (parseInt(index) === selectedOptions.length - 1) {
            titleString += ` and ${name}`;
          } else {
            titleString += `, ${name}`;
          }
        } else {
          throw new SlashCommandError('Searched for unsearchable item', selectedOptions[index]);
        }
      }

      titleString += ' Image';

      const imageUrl = `https://safebooru.org//images/${image.data[0].directory}/${image.data[0].image}`;

      const imageEmbed = new EmbedBuilder()
        .setColor('#008000')
        .setURL(`https://safebooru.org/index.php?page=post&s=view&id=${image.data[0].id}`)
        .setImage(imageUrl)
        .setTitle(titleString);

      await interaction.reply({ embeds: [imageEmbed] });

      const sentMessage = await interaction.fetchReply();

      const filter = (reaction: MessageReaction, user: User) => {
        return user.id === interaction.user.id && reaction.emoji.name === '❌';
      };

      await sentMessage.react('❌');

      const server = await Server.get(interaction.guildId!);

      sentMessage
        .awaitReactions({ filter: filter, max: 1, time: 30000, errors: ['time'] })
        .then(() => {
          sentMessage.delete();

          if (server.diaryChannel) {
            const diaryChannel = interaction.guild!.channels.cache.get(server.diaryChannel);

            if (diaryChannel instanceof TextChannel) {
              diaryChannel.send(`<@${interaction.user.id}> deleted the following embed:`);
              diaryChannel.send({ embeds: [imageEmbed] });
            }
          }
        })
        .catch(() => {
          if (sentMessage) {
            const reaction = sentMessage.reactions.cache.find(
              (reaction) => reaction.emoji.name === '❌',
            );
            reaction?.remove();
          }
        });
    }
  },

  async autocomplete(interaction: AutocompleteInteraction) {
    const items = await Item.find({ where: { searchTag: Not(IsNull()) } });
    const allOptions: ApplicationCommandOptionChoiceData[] = items.map((item) => ({
      name: item.name,
      value: item.searchTag!,
    }));

    const selectedOptions: string[] = interaction.options.data.map((option) =>
      option.value!.toString(),
    );

    const nonduplicateOptions = allOptions.filter((option) =>
      selectedOptions.every((selectedOption) => option.value != selectedOption),
    );

    const focusedValue = interaction.options.getFocused();
    const filtered = nonduplicateOptions.filter((choice) =>
      choice.name.toLowerCase().includes(focusedValue),
    );

    await interaction.respond(filtered.slice(0, 25));
  },
};
