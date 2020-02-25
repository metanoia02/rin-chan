var sayhi = {
    config: require("./config.json"),

    sayhi: function(message) {
        var d = new Date();
        var n = d.getHours();
    
        if (n > 6 && n < 12) {
            message.channel.send(`Good morning ${message.author}`);
            return;
        } else if (n >= 12 && n < 18) {
            message.channel.send(`Good afternoon ${message.author}`);
            return;
        } else if (n >= 18 && n < 22) {
            message.channel.send(`Good evening ${message.author}`);
            return;
        } else {
            message.channel.send('Why are you bothering me at this time, I need to sleep!');
            return;
        }
    }
};

module.exports = sayhi