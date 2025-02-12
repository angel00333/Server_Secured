const { EmbedBuilder } = require('discord.js');
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
    name: 'eventwork',
    description: 'Gana de 2 a 3 fichas de arcade por día.',
    execute(message) {
        const userId = message.author.id;
        const economy = getEconomy();

        // Verificar si el usuario existe en el archivo y actualizar campos
        if (!economy[userId]) {
            economy[userId] = { wallet: 0, bank: 0, gems: 0, arcadeTokens: 0, medals: [], lastWorked: null };
        }
        const userData = economy[userId];

        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;

        if (userData.lastWorked && now - userData.lastWorked < oneDay) {
            return message.reply('❌ Ya has trabajado hoy. Vuelve mañana.');
        }

        // Generar recompensa aleatoria (2 a 3 ArcadeTokens)
        const tokensEarned = Math.floor(Math.random() * 2) + 2; // 2 o 3
        userData.arcadeTokens = (userData.arcadeTokens || 0) + tokensEarned;
        userData.lastWorked = now;

        // Verificar si el usuario alcanza 100 ArcadeTokens y otorgar la medalla
        if (userData.arcadeTokens >= 100 && !userData.medals.includes('<:emoji_5:1322040089999577221> Medalla de la Serpiente')) {
            userData.medals.push('<:emoji_5:1322040089999577221> Medalla de la Serpiente');
            message.channel.send(`🎉 ¡Felicidades <@${userId}>! Has ganado la **Medalla de la Serpiente** por acumular 100 fichas de arcade.`);
        }

        saveEconomy(economy);

        const embed = new EmbedBuilder()
            .setColor('#32CD32') // Color verde
            .setTitle('💼 ¡Trabajo realizado!')
            .setDescription(`Has ganado ${tokensEarned} fichas de arcade por tu esfuerzo. Ahora tienes ${userData.arcadeTokens} fichas.`)
            .setTimestamp()
            .setFooter({ text: 'Vuelve mañana para ganar más fichas.' });

        message.reply({ embeds: [embed] });
    },
};
