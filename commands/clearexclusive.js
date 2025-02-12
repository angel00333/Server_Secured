const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'clearexclusive',
    description: 'Elimina todos los mensajes de un canal, solo accesible por un usuario específico.',
    async execute(message) {
        const ownerId = '794012497010360332'; // Tu ID
        if (message.author.id !== ownerId) {
            return message.reply('Solo el usuario autorizado puede usar este comando.');
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
