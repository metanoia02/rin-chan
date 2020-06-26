const CommandException = require('../utils/CommandException.js');
const nodeHtmlToImage = require('node-html-to-image');
const Discord = require('discord.js');

module.exports = {
    phrases: {
        buy: /buy ([0-9]+) ([a-z ]+)/gi,//an a
        sell: /sell ([0-9]+) ([a-z ]+)/gi,
        leave: /leave|finished/gi
    },

    goShopping(message, command, cmdRegex, rinchan) {
        message.channel.send("Ok let's go! <:smolrin:707284808333787197>");
        const commandName = 'Go Shopping';

        const filter = response => {
            return response.author.id === message.author.id;
        };

        this.sendShopEmbed(message).then(() => {
            const collector = message.channel.createMessageCollector(filter, { time: 60000 });
            collecting = true;

            collector.on('collect', collected => { 
                try {
                    let buyRegex = new RegExp(module.exports.phrases.buy);
                    let sellRegex = new RegExp(module.exports.phrases.sell);
                    let leaveRegex = new RegExp(module.exports.phrases.leave);

                    if(buyRegex.test(collected.content)) {
                        module.exports.buyObject(collected.content, message);
                    } else if(sellRegex.test(collected.content)) {
                        module.exports.sellObject(collected.content, message);
                    } else if(leaveRegex.test(collected.content)) {
                        collector.stop();
                        collecting = false;
                    }
                } catch(err) {
                    if(err instanceof CommandException) {
                        message.channel.send(err.getEmbed(commandName)).catch(console.error);
                    } else {
                        console.log(err);
                    }
                }
            });
    
            collector.on('end', collected => {
                message.channel.send("I'm bored lets go");
            });
        });
       },

    buyObject(collectedContent, message) {
        let order = getObjectQuantity(collectedContent, module.exports.phrases.buy);

        const user  = rinchanSQL.getUser(message.author.id, message.guild.id);
        let orangeInventory = rinchanSQL.getInventory(user, 'orange');
        let buyInventory = rinchanSQL.getInventory(user, order.object.name);
        const price = order.quantity * order.object.value;

        let objectString = order.quantity > 1 ? order.object.plural : order.object.name;

        if(buyInventory.objectName === 'orange') {
            throw new CommandException("What's the point of that?", 'rinconfuse.png');
        }

        if(orangeInventory.quantity < price) {
            throw new CommandException("You don't have enough oranges for that.", 'rinwha.png');
        }

        orangeInventory.quantity -= parseInt(price);
        buyInventory.quantity += parseInt(order.quantity);

        rinchanSQL.setInventory.run(orangeInventory);
        rinchanSQL.setInventory.run(buyInventory);

        this.shopChangeObject(order.object, -order.quantity);

        message.channel.send('Ok you bought ' + order.quantity + ' ' + objectString);
        this.sendShopEmbed(message);
    },

    shopChangeObject(object, modifier) {
       let shop = rinchanSQL.getShopStock(object.name);
       let shopOranges = rinchanSQL.getShopStock('orange');

       if(shop.quantity < (modifier*-1) && modifier < 0){
           throw new CommandException('Theres not enough stock', 'rinwha.png');
       }
       if(modifier > 0 && shopOranges.quantity < (modifier * object.value)) {
        throw new CommandException('The shop doesnt have enough oranges to make the purchase.', 'rinwha.png');
       }

       shop.quantity += parseInt(modifier);
       shopOranges.quantity += parseInt(object.value*(modifier*-1));
       
       rinchanSQL.setShopStock.run(shopOranges);
       rinchanSQL.setShopStock.run(shop);
    },

    userChangeObject(object, modifier) {

    },
    
    sellObject(collectedContent,message) {
        let order = getObjectQuantity(collectedContent, module.exports.phrases.sell);

        const user  = rinchanSQL.getUser(message.author.id, message.guild.id);
        let orangeInventory = rinchanSQL.getInventory(user, 'orange');
        let sellInventory = rinchanSQL.getInventory(user, order.object.name);
        const price = order.quantity * order.object.value;

        let objectString = order.quantity > 1 ? order.object.plural : order.object.name;

        if(sellInventory.quantity < order.quantity) {
            throw new CommandException(`You don't have ${order.quantity} ${objectString}.`, 'rinwha.png');
        }

        if(sellInventory.objectName === 'orange') {
            throw new CommandException("What's the point of that?", 'rinconfuse.png');
        }

        this.shopChangeObject(order.object, order.quantity);

        orangeInventory.quantity += parseInt(price);
        sellInventory.quantity -= parseInt(order.quantity);

        rinchanSQL.setInventory.run(orangeInventory);
        rinchanSQL.setInventory.run(sellInventory);

        message.channel.send('Ok you sold ' + order.quantity + ' ' + objectString);
        this.sendShopEmbed(message);
    },

    restock(message, command, cmdRegex, rinchan) {
    },

    makeSale() {

    },

    async sendShopEmbed(message) {
        let embedString = `
        <html>
        <head>
            <style>
            body{
                background-color: #2f3136;
                color: #d9dadb;
                width:400px;
                font-family: Whitney,Helvetica Neue,Helvetica,Arial,sans-serif;
                font-size:20px;
            }
            table {
                width:100%;
                padding:5px;
                text-align:center;
            }
            th {
                font-size:24px;
            }
            </style>
        </head>
        <body>
        <table>
        <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
        </tr>`;

        let stock = rinchanSQL.getStock.all();
        let objects = rinchanSQL.getAllObjects.all();

        stock.forEach(ele => {
            embedString += `
            <tr>
                <td>${ele.objectName}</td>
                <td>${rinchanSQL.getObject(ele.objectName).value}</td>
                <td>${ele.quantity}</td>
            </tr>`
        });

        embedString += `
        </table>
        </body>
        </html>`


        nodeHtmlToImage({
			output: './images/embeds/shop.png',
			html: embedString,
			transparent: false
		}).then(() => {
			const attachment = new Discord.MessageAttachment('./images/embeds/shop.png', 'shop.png');

            const embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Orange Kingdom General Store')
            .setDescription('The best value every day for discerning Rinchans')
            .setThumbnail('http://media1.popsugar-assets.com/files/2014/01/02/666/n/1922195/574f46474ab2683d_shutterstock_498871092VjH1o.jpg.xxxlarge_2x/i/Oranges.jpg')
            .attachFiles(attachment)
            .setImage('attachment://shop.png')
            .setFooter(`Say buy or sell <quantity> <item name> eg. buy 2 lens. To leave say finished.`);

            message.channel.send(embed);
		});
    },
};

