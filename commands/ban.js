module.exports = {
    name: 'ban',
    description: 'Banea a un miembro del servidor.',
    async execute(message, args) {
        // Verificar si el usuario tiene el permiso para banear
        if (!message.member.permissions.has('BAN_MEMBERS')) {
            return message.reply('No tienes permisos para usar este comando.');
        }

        // Preguntar al usuario por el miembro a banear
        const filter = response => {
            return response.author.id === message.author.id;
        };

        // Enviar mensaje pidiendo la mención
        await message.channel.send('¿A qué miembro quieres banear? Menciona al usuario con @.');

        // Esperar la respuesta del usuario
        try {
            const collected = await message.channel.awaitMessages({
                filter,
                max: 1,
                time: 15000, // 15 segundos para responder
                errors: ['time']
            });

            const member = collected.first().mentions.members.first();

            if (!member) {
                return message.reply('No mencionaste a un miembro válido.');
            }

            if (member.id === message.author.id) {
                return message.reply('No puedes banearte a ti mismo.');
            }

            if (!member.bannable) {
                return message.reply('No puedo banear a ese miembro.');
            }

            // Bannear al miembro
            await member.ban({ reason: 'Comando de ban' });

            message.reply(`${member.user.tag} ha sido baneado del servidor.`);

        } catch (error) {
            console.error(error);
            message.reply('No se pudo banear al usuario o el tiempo ha expirado.');
        }
    },
};
