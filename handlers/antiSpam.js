module.exports = {
    handleSpam: async (message) => {
        const FLOOD_THRESHOLD = 2; // Límite de mensajes en el intervalo
        const FLOOD_INTERVAL = 100; // Intervalo de 1 segundo (1000 ms)
        const MAX_MESSAGE_LENGTH = 50; // Longitud máxima de mensaje
        const messageMap = new Map(); // Almacenará los mensajes del usuario
        const lastMessages = new Map(); // Almacenará el último mensaje del usuario

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

        // Agregar la nueva marca de tiempo
        timestamps.push(now);

        // Filtrar marcas de tiempo que son más antiguas que el intervalo de flood
        const recentMessages = timestamps.filter((timestamp) => timestamp >= now - FLOOD_INTERVAL);
        
        messageMap.set(member.id, recentMessages); // Actualizar el mapa con los mensajes recientes

        if (recentMessages.length > FLOOD_THRESHOLD) {
            try {
                await message.delete(); // Eliminar el mensaje cuando se detecte el flood
                console.log(`Mensaje de ${member.user.tag} eliminado por flood.`);
            } catch (error) {
                console.error(`No se pudo eliminar el mensaje de ${member.user.tag}:`, error);
            }
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
