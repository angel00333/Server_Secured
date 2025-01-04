const { getEconomy } = require('../economy');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'leaderboard',
    description: 'Muestra la tabla de clasificación de los usuarios con más dinero (wallet + bank).',
    async execute(message) {
        const economy = getEconomy();

        // Ordenar los usuarios por la suma de wallet y bank
        const sortedUsers = Object.entries(economy)
            .map(([userId, data]) => ({
                userId,
                total: (data.wallet || 0) + (data.bank || 0),
            }))
            .sort((a, b) => b.total - a.total) // Orden descendente por el total
            .slice(0, 10); // Mostrar solo los 10 principales

        if (sortedUsers.length === 0) {
            return message.reply('No hay datos en la economía para mostrar.');
        }

        // Crear el contenido de la tabla de clasificación
        const leaderboard = await Promise.all(sortedUsers.map(async (user, index) => {
            try {
                const fetchedUser = await message.client.users.fetch(user.userId); // Obtener usuario según ID
                return `**${index + 1}.** ${fetchedUser.username} - <a:emoji_2:1321161015261397013> ${user.total} monedas`;
            } catch {
                return `**${index + 1}.** Usuario desconocido - <a:emoji_2:1321161015261397013> ${user.total} monedas`;
            }
        }));

        // Crear el embed para la tabla de clasificación
        const embed = new EmbedBuilder()
            .setColor('#FFD700')
            .setTitle('🏆 Tabla de Clasificación (Wallet + Bank)')
            .setDescription(leaderboard.join('\n'))
            .setFooter({ text: `Solicitado por ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        message.reply({ embeds: [embed] });
    },
};