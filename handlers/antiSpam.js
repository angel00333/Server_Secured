module.exports = {
    handleSpam: async (message) => {
        const FLOOD_THRESHOLD = 3; // Límite de mensajes en el intervalo
        const FLOOD_INTERVAL = 100; // Intervalo de 1 segundo (1000 ms)
        const MAX_MESSAGE_LENGTH = 100; // Longitud máxima de mensaje
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
                // Eliminar el mensaje cuando se detecte el flood
                if (message.deletable) {
                    await message.delete(); 
                    console.log(`Mensaje de ${member.user.tag} eliminado por flood.`);
                }
            } catch (error) {
                console.error(`No se pudo eliminar el mensaje de ${member.user.tag}:`, error);
            }
            return;
        }

        // Detectar mensajes grandes
        if (message.content.length > MAX_MESSAGE_LENGTH) {
            try {
                // Eliminar el mensaje cuando se detecte que es demasiado largo
                if (message.deletable) {
                    await message.delete();
                    console.log(`Mensaje de ${member.user.tag} eliminado por ser demasiado largo.`);
                }
            } catch (error) {
                console.error(`No se pudo eliminar el mensaje de ${member.user.tag}:`, error);
            }
            return;
        }

        // Detectar mensajes repetidos
        const normalize = (text) => text.trim().toLowerCase();
        const currentMessage = normalize(message.content);

        // Si el mensaje ya fue enviado recientemente, eliminar el mensaje
        if (lastMessages.get(member.id) === currentMessage) {
            try {
                // Eliminar el mensaje repetido
                if (message.deletable) {
                    await message.delete();
                    console.log(`Mensaje repetido de ${member.user.tag} eliminado.`);
                }
            } catch (error) {
                console.error(`No se pudo eliminar el mensaje de ${member.user.tag}:`, error);
            }
        } else {
            lastMessages.set(member.id, currentMessage); // Almacenar el nuevo mensaje
        }
    },
};
