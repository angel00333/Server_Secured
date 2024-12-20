module.exports = {
    handleSpam: async (message) => {
        const FLOOD_THRESHOLD = 5; // Máximo de mensajes permitidos en el intervalo
        const FLOOD_INTERVAL = 5000; // Intervalo en milisegundos
        const messageMap = new Map();

        const member = message.member;

        // Detectar enlaces (spam)
        if (/(http|https|www\.)/i.test(message.content)) {
            try {
                await member.ban({ reason: 'Spam: envío de enlaces no permitidos.' });
                console.log(`Usuario ${member.user.tag} baneado por enviar enlaces.`);
            } catch (error) {
                console.error(`No se pudo banear a ${member.user.tag}:`, error);
            }
            return;
        }

        // Detectar flood
        const now = Date.now();
        if (!messageMap.has(member.id)) {
            messageMap.set(member.id, []);
        }

        const timestamps = messageMap.get(member.id);
        timestamps.push(now);

        // Limpiar mensajes antiguos
        while (timestamps.length && timestamps[0] < now - FLOOD_INTERVAL) {
            timestamps.shift();
        }

        if (timestamps.length > FLOOD_THRESHOLD) {
            try {
                await member.ban({ reason: 'Flood: envío masivo de mensajes.' });
                console.log(`Usuario ${member.user.tag} baneado por flood.`);
            } catch (error) {
                console.error(`No se pudo banear a ${member.user.tag}:`, error);
            }
            messageMap.delete(member.id); // Elimina datos de mensajes del usuario baneado
        }
    },
};
