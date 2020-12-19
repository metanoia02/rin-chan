const {NlpManager} = require('node-nlp');
const manager = new NlpManager({
  languages: ['en'],
  ner: {useDuckling: true, ducklingUrl: 'http://192.168.1.139:8000/parse'},
});
const Discord = require('discord.js');
const fs = require('fs');
const utils = require('./utils/utils.js');
const Args = require('./utils/Args.js');
const CommandException = require('./utils/CommandException.js');
const entityManager = require('./utils/entityManager');
const User = require('./utils/User');

module.exports = {
  async init() {
    //everyone
    manager.addNamedEntityText('everyone', 'everyone', ['en'], 'everyone');

    //christmas
    manager.addNamedEntityText('christmasSong', 'christmasSong', ['en'], ['christmas song', 'christmas carol']);

    // discord entities
    manager.addRegexEntity('user', 'en', /<!*@!*[0-9]+>/gi);
    manager.addRegexEntity('tag', 'en', /\S+#[0-9]{4}/gi);
    manager.addRegexEntity('emote', 'en', /<:\w+:\d+>/gi);

    // trims
    manager.addAfterCondition('en', 'toTrim', 'to', 'trim');
    manager.addAfterCondition('en', 'inTrim', 'in', 'trim');

    // Entity entities
    const entities = entityManager.getAll();
    entities.forEach((ele) => {
      manager.addNamedEntityText(
        'entity',
        ele.id,
        ['en'],
        ele.alts.map((alt) => alt.alt)
      );
    });

    const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));
    this.commands = new Discord.Collection();

    let outputString = '';

    for (const file of commandFiles) {
      const command = require(`./commands/${file}`);
      this.commands.set(command.config.intent, command);

      const training = command.config.training;

      if (command.hasOwnProperty('init')) command.init(manager);

      training.forEach((statement) => {
        manager.addDocument(statement.locale, statement.string, command.config.intent);
      });

      outputString += `Added ${command.config.commandName}\n`;
    }
    await manager.train();
    console.log(outputString);
  },

  async runCommand(message) {
    let command = message.content.replace(/^<@![0-9]*>\s*|^<@[0-9]*>\s*/, '');
    command = command.replace(/\s\s+/g, ' ');

    const result = await manager.process(command);
    console.log(JSON.stringify(result, null, 2));

    if (this.commands.has(result.intent)) {
      const commandModule = this.commands.get(result.intent);

      try {
        const args = new Args(command, result, message);
        if (result.sentiment.vote === 'positive' || result.sentiment.vote === 'neutral') {
          if (
            commandModule.config.permissions === 'Mods' &&
            !message.member.roles.cache.some((role) => role.name === 'Mods')
          ) {
            return false;
          }
          console.log(args);
          await new User(message).addXp(1, message);
          await commandModule.run(message, args);
        } else if (result.sentiment.vote === 'negative') {
          throw new CommandException(`Ok I won't`, 'smugrin.png');
          // negative function for each module?
        } else {
          return false;
        }
      } catch (err) {
        if (commandModule.config.scope === 'DM') {
          utils.handleError(err, commandModule.config.commandName, message.author);
        } else {
          utils.handleError(err, commandModule.config.commandName, message.channel);
        }
      }
      return true;
    }
  },
};
