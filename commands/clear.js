const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'clear',
    description: 'Elimina todos los mensajes de un canal.',
    async execute(message) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return message.reply('No tienes permisos para eliminar mensajes.');
        }

        try {
            const fetchedMessages = await message.channel.messages.fetch({ limit: 100 });
            await message.channel.bulkDelete(fetchedMessages, true);
            message.reply('Todos los mensajes del canal han sido eliminados.');
        } catch (error) {
            console.error('Error al eliminar los mensajes:', error);
            message.reply('Hubo un error al eliminar los mensajes.');
        }
    },
};
