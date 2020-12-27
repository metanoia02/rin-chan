const Quest = require('../quests/Quest');
const User = require('../utils/User');
const database = require('../utils/sql');

module.exports = {
    config: {
      training: [
        {locale: 'en', string: 'start quiz'},
        {locale: 'en', string: 'kagamine quiz'},
        {locale: 'en', string: 'start the quiz'},
      ],

      intent: 'kagamineQuiz',
      commandName: 'Kagamine Quiz',
      description: 'Test your Rin knowledge on her birthday!',

      scope: 'DM',
    },

    async run(message, args) {
        const user = new User(message);
        const quest = database.queryQuest.get('kagamineQuiz2020');

        const quizQuest = new Quest(user, quest);
        await quizQuest.execute(message);
    },
  };
