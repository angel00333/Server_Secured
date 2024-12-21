const { getEconomy, updateEconomy } = require('../economy');
const { MessageEmbed } = require('discord.js');

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
            '¡Gran esfuerzo! El trabajo duro tiene sus recompensas.',
            '¡El sudor de tu frente ha pagado!',
            '¡Hoy fue un buen día en el trabajo!',
            '¡Excelente! Cada paso te acerca a tus metas.',
            '¡Has demostrado dedicación en tu trabajo!'
        ];

        const randomPhrase = workPhrases[Math.floor(Math.random() * workPhrases.length)];

        updateEconomy(economy); // Guardar los datos actualizados

        const embed = new MessageEmbed()
            .setColor('#00FF00')
            .setTitle('¡Trabajo Realizado!')
            .setDescription(`${randomPhrase}\nHas trabajado y ganado $${earned}.`)
            .setFooter('💼 Sigue acumulando tu fortuna', 'https://i.imgur.com/xY8YpE8.png') // Aquí puedes cambiar la imagen del footer
            .setTimestamp();

        message.reply({ embeds: [embed] });
    },
};
