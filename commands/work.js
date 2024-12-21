const { getEconomy, updateEconomy } = require('../economy');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'work',
    description: 'Trabaja para ganar dinero.',
    execute(message) {
        const user = message.author.id;
        const economy = getEconomy();

        if (!economy[user]) economy[user] = { wallet: 0, bank: 0 };
        const earned = Math.floor(Math.random() * 100) + 1; // Gana entre $1 y $100
        economy[user].wallet += earned;

        // Frases aleatorias para el trabajo
        const workPhrases = [
            'Trabajaste como moderador de discord y has ganado',
            'Trabajaste en una panaderia todo el dia y has ganado',
            'Vendiste cosas de valor y has ganado',
            'Trabajaste como mesero en un restaurante y has ganado',
            'Trabajaste como albañil y ganaste'
        ];

        const randomPhrase = workPhrases[Math.floor(Math.random() * workPhrases.length)];

        updateEconomy(economy); // Guardar los datos actualizados

        const embed = new EmbedBuilder()
            .setColor('#FFD700')
            .setTitle('¡Trabajo Realizado!')
            .setDescription(`${randomPhrase} $${earned}.`)
            .setThumbnail(message.author.displayAvatarURL()) // Icono del usuario en la parte superior izquierda
            .setFooter({ text: 'Server Secured', iconURL: message.client.user.displayAvatarURL() }) // Icono del bot en el footer
            .setTimestamp();

        message.reply({ embeds: [embed] });
    },
};
