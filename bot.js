
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { handleMessageReward } = require('./handlers/rewards');
const { handleSpam } = require('./handlers/antiSpam');
const express = require('express');
const path = require('path');
const fs = require('fs');

// =====================================
// SERVIDOR HTTP PARA RENDER
// =====================================

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Bot de Discord funcionando');
});

// =====================================
// CLIENTE DE DISCORD
// =====================================

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Token almacenado en Render
const TOKEN = process.env.DISCORD_TOKEN;

// Colección de comandos
client.commands = new Collection();

// =====================================
// CARGAR COMANDOS
// =====================================

const commandsPath = path.join(__dirname, 'commands');

const commandFiles = fs.readdirSync(commandsPath)
    .filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    client.commands.set(command.name, command);
}

// =====================================
// ESTADO DEL BOT
// =====================================

app.get('/health', (req, res) => {
    const online = client.isReady();

    res.status(online ? 200 : 503).json({
        status: online ? 'online' : 'offline',
        bot: online ? client.user.tag : null,
        uptime: Math.floor(process.uptime()),
        timestamp: new Date().toISOString()
    });
});

// =====================================
// EVENTOS DE DISCORD
// =====================================

client.once('ready', () => {
    console.log(`¡Bot conectado como ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    try {
        // Manejar spam y flood
        await handleSpam(message);

        // Manejar recompensas
        await handleMessageReward(message.member, message);

        // Manejar comandos
        const prefix = 'w!';

        if (!message.content.startsWith(prefix)) return;

        const args = message.content
            .slice(prefix.length)
            .trim()
            .split(/\s+/);

        const commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName);

        if (!command) return;

        try {
            await command.execute(message, args);
        } catch (error) {
            console.error(
                `Error ejecutando el comando ${commandName}:`,
                error
            );

            await message.reply(
                'Hubo un error ejecutando ese comando.'
            );
        }

    } catch (error) {
        console.error('Error procesando mensaje:', error);
    }
});

// =====================================
// INICIAR SERVIDOR HTTP
// =====================================

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor HTTP activo en puerto ${PORT}`);
});

// =====================================
// CONECTAR A DISCORD
// =====================================

if (!TOKEN) {
    console.error('ERROR: Falta DISCORD_TOKEN');
    process.exit(1);
}

client.login(TOKEN).catch(error => {
    console.error('Error conectando a Discord:', error);
    process.exit(1);
});
