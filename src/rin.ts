import tokens from './tokens.json';
import { client } from './client';

// Listeners
import interactionCreate from './listeners/interactionCreate';
import ready from './listeners/ready';

console.log('Rin-chan is waking up...');

ready(client);
interactionCreate(client);

client.login(tokens.token);
