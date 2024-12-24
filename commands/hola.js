module.exports = {
    name: 'hola', // Nombre del comando
    description: 'Responde con un saludo.', // Descripción
    execute(message) {
        message.reply('¡Hola! Estoy funcionando del orto. :emoji_2:');
    },
};
