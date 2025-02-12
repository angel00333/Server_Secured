const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'unmute', // Nombre del comando
    description: 'Desmutea a un usuario.', // Descripción
    async execute(message, args) {
        // Verificar permisos del usuario que ejecuta el comando
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('No tienes permisos para usar este comando.');
        }

        // Verificar si se mencionó un usuario o se proporcionó un ID
        const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!target) {
            return message.reply('Por favor, menciona a un usuario o proporciona su ID.');
        }

        // Verificar si el rol "Muteado" existe
        const muteRole = message.guild.roles.cache.find(role => role.name === 'Muteado');
        if (!muteRole) {
            return message.reply('No existe un rol "Muteado" en este servidor.');
        }

        // Verificar si el usuario tiene el rol "Muteado"
        if (!target.roles.cache.has(muteRole.id)) {
            return message.reply('Este usuario no está muteado.');
        }

        // Quitar el rol "Muteado"
        try {
            await target.roles.remove(muteRole);
            message.reply(`¡${target.user.tag} ha sido desmuteado!`);
        } catch (error) {
            console.error('Error al desmutear al usuario:', error);
            message.reply('Hubo un error al desmutear al usuario.');
        }
    },
};