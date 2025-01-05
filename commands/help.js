const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'help', // Nombre del comando
    description: 'Proporciona una lista de todos los comandos del bot.', // Descripción
    execute(message) {
        // Categorías de comandos y sus descripciones
        const categories = [
            {
                title: 'Comandos Generales',
                commands: [
                    { name: '!help', description: 'Muestra esta lista de comandos.' },
                    { name: '!mute', description: 'Silencia a un usuario (solo admin).' },
                    { name: '!ban', description: 'Banea a un usuario (solo admin).' },
                    { name: '!unban', description: 'Desbanea a un usuario (solo admin).' },
                    { name: '!clearmsg', description: 'Borrar cierta cantidad de mensajes en un canal (solo admin).' },
                    { name: '!unmutw', description: 'Desmutea a un usuario (solo admin).' },
                ],
            },
            {
                title: 'Comandos de Economía',
                commands: [
                    { name: '!work', description: 'Trabaja para ganar dinero.' },
                    { name: '!leaderboard', description: 'Muestra la tabla de clasificación de los usuarios más ricos.' },
                    { name: '!wallet', description: 'Consulta tu billetera.' },
                    { name: '!deposit', description: 'Deposita dinero en tu banco.' },
                    { name: '!withdraw', description: 'Saca dinero de tu banco.' },
                    { name: '!createcode', description: 'Crea un codigo canjeable (solo admin).' },
                    { name: '!redeem', description: 'Canjea un codigo.' },
                    { name: '!share', description: 'Comparte monedas con un usuario.' },
                ],
            },
        ];

        // Formatear los comandos para el embed
        const commandDescriptions = categories.map(category => {
            const commands = category.commands.map(cmd => `**${cmd.name}** - ${cmd.description}`).join('\n');
            return `**${category.title}**\n${commands}`;
        }).join('\n\n');

        // Crear el embed
        const embed = new EmbedBuilder()
            .setColor('#FFD700')
            .setTitle('📜 Comandos Disponibles')
            .setDescription(commandDescriptions)
            .setFooter({ text: `Solicitado por ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        // Enviar el embed
        message.reply({ embeds: [embed] });
    },
};
