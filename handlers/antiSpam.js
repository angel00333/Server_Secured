const { getEconomy, updateEconomy } = require('../economy');
const { handleMessageReward } = require('./rewards');

module.exports = {
    handleSpam: async (message) => {
        const FLOOD_THRESHOLD = 5;
        const FLOOD_INTERVAL = 5000;
        const MAX_MESSAGE_LENGTH = 1000;
        const MESSAGE_HISTORY_LIMIT = 10;
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

        // Detectar flood (palabras repetidas o letras solas)
        const now = Date.now();
        if (!messageMap.has(member.id)) {
            messageMap.set(member.id, []);
        }
        const timestamps = messageMap.get(member.id);
        timestamps.push(now);
        messageMap.set(
            member.id,
            timestamps.filter((timestamp) => timestamp >= now - FLOOD_INTERVAL)
        );

        if (timestamps.length > FLOOD_THRESHOLD) {
            try {
                await member.ban({ reason: 'Flood: envío masivo de mensajes.' });
                console.log(`Usuario ${member.user.tag} baneado por flood.`);
            } catch (error) {
                console.error(`No se pudo banear a ${member.user.tag}:`, error);
            }
            messageMap.delete(member.id);
            return;
        }

        // Detectar palabras repetidas horizontal y verticalmente
        const normalize = (text) => text.trim().toLowerCase();
        const currentMessage = normalize(message.content);
        const currentWords = new Set(currentMessage.split(/\s+/));

        if (!lastMessages.has(member.id)) {
            lastMessages.set(member.id, []);
        }

        const userMessages = lastMessages.get(member.id);
        for (const previousMessage of userMessages) {
            const previousWords = new Set(previousMessage.split(/\s+/));
            if ([...currentWords].some((word) => previousWords.has(word))) {
                try {
                    await message.delete();
                    console.log(`Mensaje repetido de ${member.user.tag} eliminado.`);
                } catch (error) {
                    console.error(`No se pudo eliminar el mensaje de ${member.user.tag}:`, error);
                }
                return;
            }
        }

        // Almacenar mensajes recientes (hasta el límite)
        userMessages.push(currentMessage);
        if (userMessages.length > MESSAGE_HISTORY_LIMIT) {
            userMessages.shift();
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
