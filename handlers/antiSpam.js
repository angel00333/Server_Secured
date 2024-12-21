const { getEconomy, updateEconomy } = require('../economy');
const { handleMessageReward } = require('./rewards');

module.exports = {
    handleSpam: async (message) => {
        const FLOOD_THRESHOLD = 5; // Mensajes consecutivos permitidos
        const messageMap = new Map(); // Para rastrear los mensajes recientes

        const member = message.member;

        // No procesar mensajes de administradores
        if (member.permissions.has('Administrator')) {
            return;
        }

        const normalize = (text) => text.trim().toLowerCase();
        const normalizedMessage = normalize(message.content);

        // Obtener historial de mensajes del usuario
        if (!messageMap.has(member.id)) {
            messageMap.set(member.id, []);
        }
        const userMessages = messageMap.get(member.id);

        // Detectar si el mensaje actual es igual a un mensaje reciente
        if (userMessages.length > 0 && userMessages[userMessages.length - 1] === normalizedMessage) {
            try {
                await message.delete();
                console.log(`Mensaje repetido de ${member.user.tag} eliminado.`);
            } catch (error) {
                console.error(`No se pudo eliminar el mensaje de ${member.user.tag}:`, error);
            }
            return;
        }

        // Agregar mensaje al historial
        userMessages.push(normalizedMessage);

        // Mantener solo los últimos FLOOD_THRESHOLD mensajes
        if (userMessages.length > FLOOD_THRESHOLD) {
            userMessages.shift();
        }
        messageMap.set(member.id, userMessages);

        // Llamar a la función de recompensa
        await handleMessageReward(member, message);
    },
};
