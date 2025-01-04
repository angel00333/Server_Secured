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
    name: 'daily',
    description: 'Reclama tu recompensa diaria.',
    execute(message) {
        const userId = message.author.id;
        const economy = getEconomy();

        // Verificar si el usuario existe en el archivo y actualizar campos
        if (!economy[userId]) {
            economy[userId] = { wallet: 0, bank: 0, gems: 0, arcadeTokens: 0, medals: [], lastDaily: null, firstDaily: true };
        }
        const userData = economy[userId];

        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;

        if (userData.lastDaily && now - userData.lastDaily < oneDay) {
            return message.reply('❌ Ya has reclamado tu recompensa diaria hoy. Vuelve mañana.');
        }

        // Determinar recompensa
        let reward = {
            tokens: 0,
            coins: 0,
            gems: 0
        };

        if (userData.firstDaily) {
            reward = { tokens: 5, coins: 1500, gems: 5 };
            userData.firstDaily = false; // Marcar que ya no es el primer uso
        } else {
            reward = { tokens: 0, coins: 100, gems: 2 };
        }

        // Actualizar economía del usuario
        userData.wallet += reward.coins;
        userData.gems += reward.gems;
        userData.arcadeTokens += reward.tokens;
        userData.lastDaily = now;

        saveEconomy(economy);

        // Crear y enviar el embed con la recompensa
        const embed = new EmbedBuilder()
            .setColor('#FFD700') // Color dorado
            .setTitle('🎉 ¡Recompensa diaria!')
            .setDescription(`Has recibido:
            - 🪙 **${reward.coins} monedas**
            - 💎 **${reward.gems} gemas**
            - 🕹️ **${reward.tokens} fichas de arcade**`)
            .setTimestamp()
            .setFooter({ text: '¡No olvides volver mañana para reclamar más!' });

        message.reply({ embeds: [embed] });
    },
};
