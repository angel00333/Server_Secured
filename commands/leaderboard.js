const { getEconomy } = require('../economy');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'leaderboard',
    description: 'Muestra la tabla de clasificación de los usuarios con más Fichas del Evento.',
    async execute(message) {
        const economy = getEconomy();

        // Ordenar los usuarios por la cantidad de dinero en la billetera
        const sortedUsers = Object.entries(economy)
            .sort(([, a], [, b]) => b.arcadeTokens - a.arcadeTokens) // Orden descendente por la billetera
            .slice(0, 10); // Mostrar solo los 10 principales

        if (sortedUsers.length === 0) {
            return message.reply('No hay datos en la economía para mostrar.');
        }

        // Crear el contenido de la tabla de clasificación
        const leaderboard = await Promise.all(sortedUsers.map(async ([userId, data], index) => {
            try {
                const user = await message.client.users.fetch(userId); // Obtener usuario según ID
                return `**${index + 1}.** ${user.username} - <a:emoji_4:1321683916305727549> ${data.arcadeTokens} fichas`;
            } catch {
                return `**${index + 1}.** Usuario desconocido - <a:emoji_4:1321683916305727549> ${data.arcadeTokens} fichas`;
            }
        }));

        // Crear el embed para la tabla de clasificación
        const embed = new EmbedBuilder()
            .setColor('#FFD700')
            .setTitle('🏆 Tabla de Clasificación')
            .setDescription(leaderboard.join('\n'))
            .setFooter({ text: `Solicitado por ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        message.reply({ embeds: [embed] });
    },
};
