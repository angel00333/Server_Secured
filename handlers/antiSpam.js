const { getEconomy, updateEconomy } = require('../economy');
const { handleMessageReward } = require('./rewards');

module.exports = {
    handleSpam: async (message) => {
        const FLOOD_THRESHOLD = 5;
        const FLOOD_INTERVAL = 5000;
        const MAX_MESSAGE_LENGTH = 1000;
        const messageMap = new Map();
        const lastMessages = new Map();

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

        // Detectar flood (vertical: mensajes repetidos consecutivamente)
        const normalize = (text) => text.trim().toLowerCase();
        const currentMessage = normalize(message.content);

        if (!lastMessages.has(member.id)) {
            lastMessages.set(member.id, []);
        }

        const userMessages = lastMessages.get(member.id);

        // Si el último mensaje es igual al actual, eliminar el actual
        if (userMessages.length > 0 && userMessages[userMessages.length - 1] === currentMessage) {
            try {
                await message.delete();
                console.log(`Mensaje repetido de ${member.user.tag} eliminado.`);
            } catch (error) {
                console.error(`No se pudo eliminar el mensaje de ${member.user.tag}:`, error);
            }
            return;
        }

        // Almacenar el mensaje actual en el historial
        userMessages.push(currentMessage);
        if (userMessages.length > FLOOD_THRESHOLD) {
            userMessages.shift(); // Mantener el historial limitado
        }
        lastMessages.set(member.id, userMessages);

        // Detectar letras solas (un solo carácter repetido)
        const repeatedCharPattern = /([a-zA-Z])\1{2,}/; // Más de 2 caracteres repetidos
        if (repeatedCharPattern.test(message.content)) {
            try {
                await message.delete();
                console.log(`Mensaje de ${member.user.tag} eliminado por flood de letras solas.`);
            } catch (error) {
                console.error(`No se pudo eliminar el mensaje de ${member.user.tag}:`, error);
            }
            return;
        }

        // Llamar a la función de recompensa de 10 mensajes
        await handleMessageReward(member, message);
    },
};
