var help = {
    config: require("./config.json"),
    
    help: function(message) {
        message.channel.send("My commands are:\nHi\nHungry?\nlook for oranges\nhave an orange\n<:rinheadpat:650489863312769036>\nhelp");
    }
};

module.exports = help