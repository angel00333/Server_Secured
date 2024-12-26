const { EmbedBuilder } = require('discord.js');
const { getEconomy } = require('../economy');

module.exports = {
    name: 'wallet',
    description: 'Muestra el balance de la billetera y banco de un usuario.',
    execute(message, args) {
        // Si se proporciona un usuario mencionado, usa ese usuario; de lo contrario, usa el autor del mensaje
        const userId = args[0]?.replace(/[<@!>]/g, '') || message.author.id;
        const economy = getEconomy();

        if (!economy[userId]) economy[userId] = { 
            wallet: 0, bank: 0, gems: 0 };

        const embed = new EmbedBuilder()
            .setColor('#00FF00')  // Puedes cambiar el color si lo deseas
            .setTitle(`Balance de la Billetera y Banco de <@${userId}>`)
            .addFields(
                { name: 'Billetera', value: `<a:emoji_2:1321161015261397013> ${economy[userId].wallet}`, inline: true },
                { name: 'Banco', value: `<a:emoji_2:1321161015261397013> ${economy[userId].bank}`, inline: true },
                { name: 'Gemas', value: `<a:emoji_3:1321254218132361298> ${economy[userId].gems}`, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: '¡Gracias por usar el sistema de economía!' });

        message.reply({ embeds: [embed] });
    },
};
