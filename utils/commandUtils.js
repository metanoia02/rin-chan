// Util functions for use in multiple commands or scheduled events.
const database = require('./sql.js');
const rinChan = require('../rinChan/rinChan.js');
const Discord = require('discord.js');
const CommandException = require('./CommandException.js');

module.exports = {
  /**
   * Get leaderboard array for object in descending order
   * @param {string} object Object for leaderboard
   * @param {number} maxEntries Limit of entries in leaderboard, omit for all entries
   * @return {Array} Array of objects
   */
  getLeaderboard(object, maxEntries) {
    const board = database.objectLeaderboard.all(object);

    board.sort((a, b) => {
      return b.quantity - a.quantity;
    });

    if (maxEntries) {
      return board.slice(0, maxEntries);
    } else {
      return board.slice(0);
    }
  },

  /**
   * Check arguments for an action with one target user
   * @param {Args} args
   * @param {Discord.message} message Undefined if in DM
   */
  validateSingleUserAction(args, message) {
    if (args.mentions.length === 0) {
      throw new CommandException('You need to mention a user', 'rinwha.png');
    } else if (message) {
      if (!args[0].getDiscordUser()) {
        throw new CommandException(`They aren't in the server`, 'rinconfuse.png');
      }
    } else if (args.mentions.length !== 1) {
      throw new CommandException('Mention only one user', 'rinwha.png');
    }
  }, //check for two usercollection choice return new args?

  validateSingleTagAction(args) {
    if (args.tags.length === 0) {
      throw new CommandException('You need use a users tag e.g. rin#0202', 'rinwha.png');
    } else if (args.tags.length !== 1) {
      throw new CommandException('Tag only one user', 'rinwha.png');
    }
  },

  validateSingleObjectAction(args) {
    if (args.objects.length === 0) throw new CommandException(`What object?`, 'rinconfuse.png');
    if (args.objects.length > 1) {
      throw new CommandException(`Which one?`, 'rinconfuse.png');
    }
  },

  validateSingleInteraction(args) {
    if (args.interactions.length === 0) throw new CommandException(`What should I do?`, 'rinconfuse.png');
    if (args.interactions.length > 1) {
      throw new CommandException(`Which one?`, 'rinconfuse.png');
    }
  },
};
