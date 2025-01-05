const { EmbedBuilder } = require('discord.js');
const fs = require('fs');

// Funciones para manejar userdata.json
function getUserData() {
    try {
        const data = fs.readFileSync('./userdata.json', 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al leer el archivo userdata.json:', error);
        return {};
    }
}

function saveUserData(userdata) {
    try {
        fs.writeFileSync('./userdata.json', JSON.stringify(userdata, null, 2));
    } catch (error) {
        console.error('Error al guardar el archivo userdata.json:', error);
    }
}

// Funciones para manejar economy.json
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

        // Obtener datos de userdata.json y economy.json
        const userdata = getUserData();
        const economy = getEconomy();

        // Inicializar usuario en userdata.json si no existe
        if (!userdata[userId]) {
            userdata[userId] = { firstDaily: true, lastDaily: null };
        }

        const userEconomy = economy[userId] || { wallet: 0, bank: 0, gems: 0, arcadeTokens: 0, medals: [] };

        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;

        if (userdata[userId].lastDaily && now - userdata[userId].lastDaily < oneDay) {
            return message.reply('❌ Ya has reclamado tu recompensa diaria. Vuelve mañana.');
        }

        let rewardMessage;
        let rewards;

        // Primera vez
        if (userdata[userId].firstDaily) {
            rewards = { wallet: 1500, gems: 5, arcadeTokens: 5 };
            userEconomy.wallet += rewards.wallet;
            userEconomy.gems += rewards.gems;
            userEconomy.arcadeTokens += rewards.arcadeTokens;
            userdata[userId].firstDaily = false;
            rewardMessage = '¡Has recibido el paquete de bienvenida!';
        } else {
            // Recompensa diaria regular
            rewards = { wallet: 100, gems: 2 };
            userEconomy.wallet += rewards.wallet;
            userEconomy.gems += rewards.gems;
            rewardMessage = '¡Has reclamado tu recompensa diaria!';
        }

        // Actualizar tiempo de última recompensa
        userdata[userId].lastDaily = now;

        // Guardar datos actualizados
        economy[userId] = userEconomy;
        saveUserData(userdata);
        saveEconomy(economy);

        const embed = new EmbedBuilder()
            .setColor('#FFD700')
            .setTitle('🎁 Recompensa Diaria')
            .setDescription(rewardMessage)
            .addFields(
                { name: 'Monedas Recibidas', value: `<a:emoji_2:1321161015261397013> ${rewards.wallet}`, inline: true },
                { name: 'Gemas Recibidas', value: `<a:emoji_3:1321254218132361298> ${rewards.gems}`, inline: true },
                rewards.arcadeTokens !== undefined
                    ? { name: 'Fichas de Arcade Recibidas', value: `<a:emoji_4:1321683916305727549> ${rewards.arcadeTokens}`, inline: true }
                    : null
            )
            .setTimestamp();

        message.reply({ embeds: [embed] });
    },
};
