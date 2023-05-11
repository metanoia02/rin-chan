import { Client } from "discord.js";
import tokens from "./tokens.json";

console.log("Rin-chan is waking up...");

const client = new Client({
    intents: []
});

client.login(tokens.token)

console.log(client);