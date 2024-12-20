module.exports = {
    name: 'unban',
    description: 'Desbanea a un miembro del servidor usando su ID.',
    async execute(message, args) {
        // Verificar si el usuario tiene el permiso para desbanear
        if (!message.member.permissions.has('BAN_MEMBERS')) {
            return message.reply('No tienes permisos para usar este comando.');
        }

        // Verificar si se proporciona un ID válido
        if (!args.length) {
            return message.reply('Por favor, proporciona el ID del usuario que deseas desbanear.');
        }

        const userId = args[0];

        try {
            // Intentar desbanear al miembro usando su ID
            const user = await message.guild.bans.fetch(userId);

            // Desbanear al usuario
            await message.guild.members.unban(user.user, 'Comando de unban');

            message.reply(`El usuario con ID ${userId} ha sido desbaneado del servidor.`);
        } catch (error) {
            console.error(error);
            message.reply('No se pudo desbanear al usuario. Asegúrate de que el ID es correcto o que el usuario está baneado.');
        }
    },
};
