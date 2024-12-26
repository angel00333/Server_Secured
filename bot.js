const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { handleSpam } = require('./handlers/antiSpam');
const fs = require('fs');


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

const TOKEN = 'MTMxOTQxMjkwODk1Mzk2MDYzMA.GCgtVH.u1FH6bJ1__14PdAZg79ZtQHT0iM7xOjJsZ9vkA';

// Colección de comandos
client.commands = new Collection();

// Cargar comandos desde el directorio commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log(`¡Bot conectado como ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
    // Ignorar mensajes del bot
    if (message.author.bot) return;

    // Manejar spam y flood
    await handleSpam(message);

    // Manejar comandos
    const prefix = '!'; // Cambia el prefijo según tu preferencia
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/\s+/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);

    if (!command) return;

    try {
        await command.execute(message, args);
    } catch (error) {
        console.error(`Error ejecutando el comando ${commandName}:`, error);
        await message.reply('Hubo un error ejecutando ese comando.');
    }
});

client.login(TOKEN);