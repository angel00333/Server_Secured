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
    } catch (error) {
        console.error('Error al guardar el archivo economy.json:', error);
    }
}

module.exports = {
    name: 'rob',
    description: 'Roba dinero de la billetera de otro usuario.',
    execute(message, args) {
        const userId = message.author.id;
        const victimId = args[0]?.replace(/[<@!>]/g, ''); // ID de la víctima
        const economy = getEconomy();

        if (!victimId || !economy[victimId]) {
            return message.reply('El usuario objetivo no existe o no tiene una billetera.');
        }

        if (victimId === userId) {
            return message.reply('¡No puedes robarte a ti mismo!');
        }

        if (!economy[userId]) economy[userId] = { wallet: 0, bank: 0 };

        // Verificar si la víctima tiene suficiente dinero
        const victimWallet = economy[victimId].wallet;
        if (victimWallet < 80) {
            return message.reply('El usuario objetivo no tiene suficiente dinero para robar.');
        }

        // Probabilidad de fallar (30%)
        const chance = Math.random();
        if (chance < 0.3) {
            const penalty = 50; // Penalización fija por fallar
            economy[userId].wallet = Math.max(0, economy[userId].wallet - penalty); // Asegura que no sea negativo
            saveEconomy(economy);

            const failEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('¡Robo Fallido!')
                .setDescription(`Intentaste robar a <@${victimId}>, pero te atraparon y perdiste $${penalty}.`)
                .addFields({ name: 'Tu Nuevo Saldo', value: `$${economy[userId].wallet}`, inline: true })
                .setTimestamp();

            return message.reply({ embeds: [failEmbed] });
        }

        // Robo exitoso (70%)
        const amount = Math.floor(Math.random() * (100 - 80 + 1)) + 80;

        // Ajustar los saldos
        economy[victimId].wallet -= amount;
        economy[userId].wallet += amount;

        saveEconomy(economy);

        const successEmbed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('¡Robo Exitoso!')
            .setDescription(`Robaste $${amount} de la billetera de <@${victimId}>.`)
            .addFields(
                { name: 'Tu Nuevo Saldo', value: `$${economy[userId].wallet}`, inline: true },
                { name: 'Saldo de la Víctima', value: `$${economy[victimId].wallet}`, inline: true }
            )
            .setTimestamp();

        message.reply({ embeds: [successEmbed] });
    },
};
