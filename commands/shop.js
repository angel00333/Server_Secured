const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'shop',
    description: 'Muestra la tienda de objetos',
    execute(message) {
        const embed = new EmbedBuilder()
            .setColor('#FFD700')
            .setTitle('🛒 Tienda de Objetos')
            .setDescription('Compra objetos útiles para tus aventuras. Usa el comando `!buy <objeto>` para comprar un objeto.')
            .addFields(
                { name: 'Martillo', value: 'Costo: 1500 monedas. Úsalo para robar a otro usuario con `!use hammer <mención>`.' },
                { name: 'Reverseuno', value: 'Costo: 10 gemas. Úsalo para devolver un martillazo con `!use reverseuno`.' },
            )
            .setTimestamp();
        
        message.reply({ embeds: [embed] });
    },
};
