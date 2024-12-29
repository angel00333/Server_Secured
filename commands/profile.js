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
        console.log('Economy actualizado:', JSON.stringify(economy, null, 2)); // Depuración
    } catch (error) {
        console.error('Error al guardar el archivo economy.json:', error);
    }
}

module.exports = {
    name: 'profile',
    description: 'Muestra el perfil de un usuario con monedas, gemas, fichas de arcade y medallas.',
    execute(message, args) {
        const userId = args[0]?.replace(/[<@!>]/g, '') || message.author.id;
        const economy = getEconomy();

        if (!economy[userId]) {
            economy[userId] = { wallet: 0, bank: 0, gems: 0, arcadeTokens: 0, medals: [] };
            saveEconomy(economy);
        } else {
            // Asegurar que todos los campos necesarios estén presentes
            if (economy[userId].gems === undefined) economy[userId].gems = 0;
            if (economy[userId].arcadeTokens === undefined) economy[userId].arcadeTokens = 0;
            if (!Array.isArray(economy[userId].medals)) economy[userId].medals = [];
        }

        // Obtener las medallas del usuario
        const medals = economy[userId].medals.length > 0
            ? economy[userId].medals.join(', ')  // Unir las medallas con comas
            : 'Sin medallas por ahora.';

        const embed = new EmbedBuilder()
            .setColor('#3498DB') // Color del embed
            .setTitle(`Perfil de <@${userId}>`)
            .addFields(
                { name: 'Monedas', value: `<a:emoji_2:1321161015261397013> ${economy[userId].wallet}`, inline: true },
                { name: 'Gemas', value: `<a:emoji_3:1321254218132361298> ${economy[userId].gems}`, inline: true },
                { name: 'Fichas de Arcade', value: `<a:emoji_4:1321683916305727549> ${economy[userId].arcadeTokens}/100`, inline: true },
                { name: 'Medallas', value: medals, inline: false }
            )
            .setTimestamp()
            .setFooter({ text: '¡Feliz año de la Serpiente!' });

        message.reply({ embeds: [embed] });
    },
};
