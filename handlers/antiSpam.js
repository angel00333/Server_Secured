module.exports = {
    handleSpam: async (message) => {
        const FLOOD_THRESHOLD = 5;
        const FLOOD_INTERVAL = 5000;
        const MAX_MESSAGE_LENGTH = 1000;
        const messageMap = new Map();
        const lastMessages = new Map();

        const member = message.member;

        // Detectar enlaces
        if (/(http|https|www\.)/i.test(message.content)) {
            try {
                await member.ban({ reason: 'Spam: envío de enlaces no permitidos.' });
                console.log(`Usuario ${member.user.tag} baneado por enviar enlaces.`);
            } catch (error) {
                console.error(`No se pudo banear a ${member.user.tag}:`, error);
            }
            return;
        }

        const now = Date.now();

        // Detectar flood
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

        // Detectar mensajes grandes
        if (message.content.length > MAX_MESSAGE_LENGTH) {
            try {
                await message.delete();
                console.log(`Mensaje de ${member.user.tag} eliminado por ser demasiado largo.`);
            } catch (error) {
                console.error(`No se pudo eliminar el mensaje de ${member.user.tag}:`, error);
            }
            return;
        }

        // Detectar mensajes repetidos
        const normalize = (text) => text.trim().toLowerCase();
        const currentMessage = normalize(message.content);

        if (lastMessages.get(member.id) === currentMessage) {
            try {
                await message.delete();
                console.log(`Mensaje repetido de ${member.user.tag} eliminado.`);
            } catch (error) {
                console.error(`No se pudo eliminar el mensaje de ${member.user.tag}:`, error);
            }
            return;
        }

        lastMessages.set(member.id, currentMessage);
    },
};
