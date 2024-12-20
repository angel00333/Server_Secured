module.exports = {
    name: 'help', // Nombre del comando
    description: 'Proporciona todos los comandos del bot.', // Descripción
    execute(message) {
        message.reply('Hola estos son mis comandos por ahora (!ban, !unban, !mute).');
    },
};