const { EmbedBuilder } = require('discord.js');
const fs = require('fs');

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
    name: 'crime',
    description: 'Roba dinero con una frase aleatoria.',
    execute(message) {
        const userId = message.author.id;
        const economy = getEconomy();

        if (!economy[userId]) economy[userId] = { wallet: 0, bank: 0 };

        // Generar monto aleatorio y frases
        const amount = Math.floor(Math.random() * (50 - 30 + 1)) + 30;
        const phrases = [
            `¡Asaltaste una tienda y ganaste $${amount}!`,
            `Robaste una cartera en el parque y obtuviste $${amount}!`,
            `Te salió bien el golpe y conseguiste $${amount}!`,
            `Robaste un banco y obtuviste $${amount}!`
        ];
        const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];

        // Actualizar economía
        economy[userId].wallet += amount;
        saveEconomy(economy);

        const embed = new EmbedBuilder()
            .setColor('#FF4500')
            .setTitle('¡Crimen Cometido!')
            .setDescription(randomPhrase)
            .addFields({ name: 'Nuevo Saldo', value: `$${economy[userId].wallet}`, inline: true })
            .setTimestamp();

        message.reply({ embeds: [embed] });
    },
};
