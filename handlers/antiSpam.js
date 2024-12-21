const { getEconomy, updateEconomy } = require('../economy');
const { handleMessageReward } = require('./rewards');

module.exports = {
    handleSpam: async (message) => {
        const FLOOD_THRESHOLD = 5;
        const FLOOD_INTERVAL = 5000;
        const messageHistory = new Map();

        const member = message.member;

        // No procesar mensajes de administradores
        if (member.permissions.has('Administrator')) {
            return;
        }

        // Detectar enlaces
        const urlPattern = /(http|https|www\.)/i;
        if (urlPattern.test(message.content)) {
            try {
                await member.ban({ reason: 'Spam: envío de enlaces no permitidos.' });
                console.log(`Usuario ${member.user.tag} baneado por enviar enlaces.`);
            } catch (error) {
                console.error(`No se pudo banear a ${member.user.tag}:`, error);
            }
            return;
        }

        // Normalizar mensaje (convertir a minúsculas y quitar espacios extra)
        const normalize = (text) => text.trim().toLowerCase();
        const currentMessage = normalize(message.content);

        // Revisar historial de mensajes del usuario
        if (!messageHistory.has(member.id)) {
            messageHistory.set(member.id, []);
        }

        const userMessages = messageHistory.get(member.id);

        // Detectar si el mensaje actual es igual al último
        if (userMessages.length > 0 && userMessages[userMessages.length - 1] === currentMessage) {
            try {
                await message.delete();
                console.log(`Mensaje repetido de ${member.user.tag} eliminado.`);
            } catch (error) {
                console.error(`No se pudo eliminar el mensaje de ${member.user.tag}:`, error);
            }
            return;
        }

        // Agregar mensaje al historial y limitar su tamaño
        userMessages.push(currentMessage);
        if (userMessages.length > FLOOD_THRESHOLD) {
            userMessages.shift(); // Mantener solo los últimos N mensajes
        }
        messageHistory.set(member.id, userMessages);

        // Llamar a la función de recompensa de 10 mensajes
        await handleMessageReward(member, message);
    },
};
