/*
client.on("message", async (message) => {
  const reg = "^<@" + rinChan.getId() + ">|^<@!" + rinChan.getId() + ">";
  const rinTest = new RegExp(reg);

  if (!message.author.bot) {
    if (utils.mentionSpamDetect(message)) {
      return null;
    }

    if (
      message.mentions.has(client.user) &&
      message.guild &&
      rinTest.test(message.content)
    ) {
      if (message.content.length < 23 && !rinChan.getCollecting()) {
        message.channel.send("Yes?");
      } else if (message.content.length > 23) {
        if (!(await moduleManager.runCommand(message))) {
          if (!rinChan.getCollecting()) {
            message.channel.send("<:rinwha:787036890606993438>");
          }
        }
      }
    } else if (!rinChan.getCollecting()) {
      const trigger = config.triggerWords.find((element) =>
        element.test(message.content, rinChan)
      );
      if (trigger) message.channel.send(trigger.response);
    }
  }
});
*/
