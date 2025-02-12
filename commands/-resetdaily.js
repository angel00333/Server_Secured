const { EmbedBuilder } = require('discord.js');
const fs = require('fs');

// Funciones para manejar userdata.json
function getUserData() {
    try {
        const data = fs.readFileSync('./userdata.json', 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al leer el archivo userdata.json:', error);
        return {};
    }
}

function saveUserData(userdata) {
    try {
        fs.writeFileSync('./userdata.json', JSON.stringify(userdata, null, 2));
    } catch (error) {
        console.error('Error al guardar el archivo userdata.json:', error);
    }
}

module.exports = {
    name: 'resetdaily',
    description: 'Restablece el estado de las recompensas diarias de un usuario.',
    execute(message, args) {
        // Verificar permisos de administrador
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.reply('❌ No tienes permisos para usar este comando.');
        }

        const userId = args[0];
        if (!userId) {
            return message.reply('❌ Debes proporcionar el ID del usuario cuyo estado de recompensas deseas restablecer.');
        }

        const userdata = getUserData();

        // Restablecer el estado del usuario
        userdata[userId] = { firstDaily: true, lastDaily: null };
        saveUserData(userdata);

        const embed = new EmbedBuilder()
            .setColor('#FF4500')
            .setTitle('🔄 Estado Restablecido')
            .setDescription(`El estado de recompensas diarias del usuario con ID **${userId}** ha sido restablecido.`)
            .setTimestamp();

        message.reply({ embeds: [embed] });
    },
};
