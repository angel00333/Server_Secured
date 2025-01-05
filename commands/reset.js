const { getEconomy, updateEconomy } = require('../economy');

module.exports = {
    name: 'reset', // Nombre del comando
    description: 'Reinicia la economía de todos los usuarios', // Descripción
    async execute(message) {
        // Verificar si el autor del mensaje tiene permisos de administrador
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.reply('¡No tienes permisos para reiniciar la economía!');
        }

        // Obtener la economía actual
        const economy = getEconomy();

        // Reiniciar la economía (poner todos los saldos a cero)
        for (let userId in economy) {
            economy[userId] = { wallet: 0, bank: 0, gems: 0, arcadeTokens: 0 };
        }

        // Actualizar la economía con los nuevos valores (todos a cero)
        updateEconomy(economy);

        // Enviar un mensaje de confirmación
        message.reply('¡La economía de todos los usuarios ha sido reiniciada!');
    },
};
