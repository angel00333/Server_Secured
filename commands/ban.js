const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'ban', // Nombre del comando
    description: 'Banea a un usuario del servidor.', // Descripción
    async execute(message, args) {
        // Verificar permisos del usuario que ejecuta el comando
        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return message.reply('No tienes permisos para banear usuarios.');
        }

        // Obtener el usuario mencionado o por ID
        const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!target) {
            return message.reply('Por favor, menciona a un usuario o proporciona su ID.');
        }

        // Verificar si el usuario puede ser baneado
        if (!target.bannable) {
            return message.reply('No puedo banear a este usuario. ¿Tengo los permisos necesarios?');
        }

        // Banear al usuario
        try {
            await target.ban({ reason: 'Baneado por comando !ban' });
            message.reply(`¡${target.user.tag} ha sido baneado del servidor!`);
        } catch (error) {
            console.error('Error al banear al usuario:', error);
            message.reply('Hubo un error al banear al usuario.');
        }
    },
};