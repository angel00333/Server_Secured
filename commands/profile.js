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
    name: 'profile',
    description: 'Muestra el perfil de un usuario con monedas, gemas y fichas de arcade.',
    execute(message, args) {
        // Si se proporciona un usuario mencionado, usa ese usuario; de lo contrario, usa el autor del mensaje
        const userId = args[0]?.replace(/[<@!>]/g, '') || message.author.id;
        const economy = getEconomy();

        if (!economy[userId]) {
            economy[userId] = { wallet: 0, bank: 0, gems: 0, arcadeTokens: 0 };
            saveEconomy(economy);
        } else {
            // Asegurar que todos los campos necesarios estén presentes
            if (economy[userId].gems === undefined) economy[userId].gems = 0;
            if (economy[userId].arcadeTokens === undefined) economy[userId].arcadeTokens = 0;
        }

        const embed = new EmbedBuilder()
            .setColor('#3498DB')  // Color del embed
            .setTitle(`Perfil de <@${userId}>`)
            .addFields(
                { name: 'Monedas', value: `<a:emoji_2:1321161015261397013> ${economy[userId].wallet}`, inline: true },
                { name: 'Gemas', value: `<a:emoji_3:1321254218132361298> ${economy[userId].gems}`, inline: true },
                { name: 'Fichas de Arcade', value: `<a:emoji_4:1321683916305727549> ${economy[userId].arcadeTokens}/100`, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: '¡Feliz año de la Serpiente!' });

        message.reply({ embeds: [embed] });
    },
};
