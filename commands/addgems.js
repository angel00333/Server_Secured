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
    name: 'addgems',
    description: 'Agrega gemas a un usuario.',
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
            return message.reply('Por favor ingresa una cantidad válida de gemas.');
        }

        const economy = getEconomy();

        // Inicializar al usuario si no existe
        if (!economy[userId]) {
            economy[userId] = { wallet: 0, bank: 0, gems: 0 };
        } else if (economy[userId].gems === undefined) {
            economy[userId].gems = 0; // Asegurar que el campo "gems" exista
        }

        // Agrega la cantidad de gemas al usuario
        economy[userId].gems += amount;

        // Guardar cambios en el archivo JSON
        saveEconomy(economy);

        // Crear el embed para la respuesta
        const embed = new EmbedBuilder()
            .setColor('#FFD700')
            .setTitle('Gemas Agregadas')
            .addFields(
                { name: 'Usuario', value: `<@${userId}>`, inline: true },
                { name: 'Gemas Agregadas', value: `${amount}`, inline: true },
                { name: 'Total de Gemas', value: `${economy[userId].gems}`, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: '¡Gracias por usar el sistema de economía!' });

        message.reply({ embeds: [embed] });
    },
};
