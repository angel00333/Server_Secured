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
    name: 'share',
    description: 'Permite a un usuario compartir monedas con otro usuario.',
    execute(message, args) {
        const senderId = message.author.id;
        const recipientId = args[0]?.replace(/[<@!>]/g, ''); // Extraer ID del destinatario
        const amount = parseInt(args[1], 10); // Cantidad a transferir

        if (!recipientId || isNaN(amount) || amount <= 0) {
            return message.reply('❌ Uso correcto: `!share @usuario cantidad`');
        }

        if (recipientId === senderId) {
            return message.reply('❌ No puedes compartir monedas contigo mismo.');
        }

        const economy = getEconomy();

        // Verificar si el remitente tiene suficientes monedas
        if (!economy[senderId] || economy[senderId].wallet < amount) {
            return message.reply('❌ No tienes suficientes monedas para realizar esta transferencia.');
        }

        // Crear el perfil del destinatario si no existe
        if (!economy[recipientId]) {
            economy[recipientId] = { wallet: 0, bank: 0, gems: 0, arcadeTokens: 0, medals: [] };
        }

        // Realizar la transferencia
        economy[senderId].wallet -= amount;
        economy[recipientId].wallet += amount;

        saveEconomy(economy);

        const embed = new EmbedBuilder()
            .setColor('#00FF7F') // Color verde claro
            .setTitle('💸 Transferencia realizada')
            .setDescription(`Has transferido ${amount} monedas a <@${recipientId}>.`)
            .addFields(
                { name: 'Tu saldo actual', value: `<a:emoji_2:1321161015261397013> ${economy[senderId].wallet}`, inline: true },
                { name: 'Saldo del destinatario', value: `<a:emoji_2:1321161015261397013> ${economy[recipientId].wallet}`, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: '¡Comparte la riqueza!' });

        message.reply({ embeds: [embed] });
    },
};
