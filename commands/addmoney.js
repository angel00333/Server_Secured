const { EmbedBuilder } = require('discord.js');
const fs = require('fs');

// Función para obtener la economía desde economy.json
function getEconomy() {
    try {
        const data = fs.readFileSync('./economy.json', 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al leer el archivo economy.json:', error);
        return {};  // Si no hay datos, retorna un objeto vacío
    }
}

// Función para guardar la economía actualizada en economy.json
function saveEconomy(economy) {
    try {
        fs.writeFileSync('./economy.json', JSON.stringify(economy, null, 2));
    } catch (error) {
        console.error('Error al guardar el archivo economy.json:', error);
    }
}

module.exports = {
    name: 'addmoney',
    description: 'Agrega dinero a la billetera de un usuario.',
    execute(message, args) {
        // Verifica si el usuario es administrador
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.reply('¡Solo los administradores pueden usar este comando!');
        }

        // Obtiene el ID del usuario y la cantidad a agregar
        const userId = args[0]?.replace(/[<@!>]/g, ''); // Permite obtener el ID si mencionas a un usuario
        const amount = parseInt(args[1]);

        // Verifica si la cantidad es válida
        if (isNaN(amount) || amount <= 0) {
            return message.reply('Por favor ingresa una cantidad válida de dinero.');
        }

        const economy = getEconomy();

        // Si el usuario no existe en la economía, lo inicializa
        if (!economy[userId]) economy[userId] = { 
            wallet: 0, bank: 0 };

        // Agrega la cantidad a la billetera del usuario
        economy[userId].wallet += amount;

        // Guarda la economía actualizada en el archivo
        saveEconomy(economy);

        // Crea un embed para mostrar el saldo actualizado
        const embed = new EmbedBuilder()
            .setColor('#FFD700')
            .setTitle('Dinero Agregado a la Billetera')
            .addFields(
                { name: 'Usuario', value: `<@${userId}>`, inline: true },
                { name: 'Cantidad Agregada', value: `$${amount}`, inline: true },
                { name: 'Nuevo Saldo', value: `$${economy[userId].wallet}`, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: '¡Gracias por usar el sistema de economía!' });

        message.reply({ embeds: [embed] });
    },
};
