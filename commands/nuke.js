module.exports = {
    name: 'nuke',
    description: 'Borra todos los mensajes de un canal.',
    async execute(message, args) {
        if (!message.member.permissions.has('MANAGE_MESSAGES')) {
            return message.reply('No tienes permisos para usar este comando.');
        }

        try {
            // Obtener todos los mensajes del canal
            const fetchedMessages = await message.channel.messages.fetch({ limit: 100 });
            
            // Borrar todos los mensajes
            await message.channel.bulkDelete(fetchedMessages);

            message.channel.send('Todos los mensajes han sido eliminados.').then(msg => {
                setTimeout(() => msg.delete(), 5000); // El mensaje de confirmación se borra después de 5 segundos
            });
        } catch (error) {
            console.error('Error al borrar los mensajes:', error);
            message.reply('Hubo un error al intentar borrar los mensajes.');
        }
    },
};
