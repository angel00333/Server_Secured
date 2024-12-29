const fs = require('fs');

// Funciones para manejar el archivo economy.json
function getEconomy() {
    try {
        const data = fs.readFileSync('./economy.json', 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al leer el archivo economy.json:', error);
        return {};
    }
}

function saveEconomy(economy) {
    try {
        fs.writeFileSync('./economy.json', JSON.stringify(economy, null, 2));
    } catch (error) {
        console.error('Error al guardar el archivo economy.json:', error);
    }
}

module.exports = {
    name: 'addtokens',
    description: 'Añade fichas de arcade a un usuario.',
    execute(message, args) {
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.reply('No tienes permisos para usar este comando.');
        }

        const userId = args[0]?.replace(/[<@!>]/g, '');
        const tokensToAdd = parseInt(args[1], 10);

        if (!userId || isNaN(tokensToAdd) || tokensToAdd <= 0) {
            return message.reply('Uso correcto: `!addtokens @usuario cantidad`');
        }

        const economy = getEconomy();

        // Inicializar usuario si no existe
        if (!economy[userId]) {
            economy[userId] = { wallet: 0, bank: 0, gems: 0, arcadeTokens: 0, medals: [] };
        } else {
            // Inicializar campos faltantes
            economy[userId].arcadeTokens = economy[userId].arcadeTokens || 0;
            economy[userId].medals = economy[userId].medals || [];
        }

        // Añadir fichas de arcade
        economy[userId].arcadeTokens += tokensToAdd;

        // Lógica para otorgar \"Medalla de la Serpiente\" por cada 100 arcadeTokens
        const tokens = economy[userId].arcadeTokens;
        const earnedMedals = Math.floor(tokens / 100);
        const currentMedals = economy[userId].medals.filter(medal => medal === '<:emoji_5:1322040089999577221> Medalla de la Serpiente').length;

        if (earnedMedals > currentMedals) {
            const newMedals = earnedMedals - currentMedals;
            for (let i = 0; i < newMedals; i++) {
                economy[userId].medals.push('<:emoji_5:1322040089999577221> Medalla de la Serpiente');
            }
        }

        saveEconomy(economy);

        message.reply(`Se han añadido ${tokensToAdd} fichas de arcade a <@${userId}>. Ahora tiene ${economy[userId].arcadeTokens} fichas.`);
    },
};
