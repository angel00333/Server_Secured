const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'unban', // Nombre del comando
    description: 'Desbanea a un usuario del servidor.', // Descripción
    async execute(message, args) {
        // Verificar permisos del usuario que ejecuta el comando
        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return message.reply('No tienes permisos para desbanear usuarios.');
        }

        // Obtener el ID del usuario baneado
        const userId = args[0];
        if (!userId) {
            return message.reply('Por favor, proporciona el ID del usuario baneado.');
        }

        // Obtener la lista de usuarios baneados
        const bannedUsers = await message.guild.bans.fetch();
        const bannedUser = bannedUsers.find(user => user.user.id === userId);

        // Verificar si el usuario está baneado
        if (!bannedUser) {
            return message.reply('Este usuario no está baneado.');
        }

        // Desbanear al usuario
        try {
            await message.guild.members.unban(userId);
            message.reply(`¡El usuario con ID ${userId} ha sido desbaneado!`);
        } catch (error) {
            console.error('Error al desbanear al usuario:', error);
            message.reply('Hubo un error al desbanear al usuario.');
        }
    },
};