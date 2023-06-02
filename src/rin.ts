import { Client, GatewayIntentBits } from "discord.js";
import tokens from "./tokens.json";

// Listeners
import interactionCreate from "./listeners/interactionCreate";
import ready from "./listeners/ready";

//Utils
import loadCommands from "./util/loadCommands"

const client = new Client({
    intents: [		
        GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
    ]
});

console.log("Rin-chan is waking up...");

loadCommands();
ready(client);
interactionCreate(client);

client.login(tokens.token)
console.log(client);