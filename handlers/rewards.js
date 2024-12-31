const { getEconomy, updateEconomy } = require('../economy');

const userMessageCount = new Map(); // Contador de mensajes por usuario

module.exports = {
    // Función que maneja la recompensa de monedas cada 10 mensajes
    handleMessageReward: async (member, message) => {
        if (!userMessageCount.has(member.id)) {
            userMessageCount.set(member.id, 0);
        }
        
        // Incrementar el contador de mensajes
        userMessageCount.set(member.id, userMessageCount.get(member.id) + 1);

        // Si el usuario ha alcanzado los 10 mensajes, darle 4 monedas
        if (userMessageCount.get(member.id) >= 10) {
            const economy = getEconomy();
            if (!economy[member.id]) economy[member.id] = { wallet: 0, bank: 0 };

            // Otorgar 4 monedas al usuario
            economy[member.id].wallet += 10;
            updateEconomy(economy); // Guardar los cambios en la economía

            message.reply('¡Has conseguido 10 monedas!');

            // Restablecer el contador de mensajes
            userMessageCount.set(member.id, 0);
        }
    },
};
