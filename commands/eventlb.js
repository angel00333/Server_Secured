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

module.exports = {
    name: 'eventlb',
    description: 'Muestra una tabla de clasificación basada en ArcadeTokens.',
    execute(message) {
        const economy = getEconomy();

        // Ordenar usuarios por ArcadeTokens
        const leaderboard = Object.entries(economy)
            .map(([id, data]) => ({ id, arcadeTokens: data.arcadeTokens || 0 }))
            .sort((a, b) => b.arcadeTokens - a.arcadeTokens)
            .slice(0, 10); // Top 10

        if (leaderboard.length === 0) {
            return message.reply('¡No hay jugadores con fichas de arcade!');
        }

        const embed = new EmbedBuilder()
            .setColor('#FFD700') // Color dorado
            .setTitle('🏆 Tabla de Clasificación de ArcadeTokens')
            .setDescription('Top 10 jugadores con más fichas de arcade.')
            .addFields(
                leaderboard.map((entry, index) => ({
                    name: `#${index + 1} <@${entry.id}>`,
                    value: `${entry.arcadeTokens} fichas`,
                    inline: false,
                }))
            )
            .setTimestamp()
            .setFooter({ text: '¡Sigue participando para subir en la tabla!' });

        message.reply({ embeds: [embed] });
    },
};
