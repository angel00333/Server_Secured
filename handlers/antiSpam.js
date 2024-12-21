module.exports = {
    handleSpam: async (message) => {
        const FLOOD_THRESHOLD = 5;
        const FLOOD_INTERVAL = 5000;
        const MAX_MESSAGE_LENGTH = 1000;
        const messageMap = new Map();
        const lastMessages = new Map();

        const member = message.member;

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

        // Detectar flood de palabras repetidas
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

        // Detectar imágenes NSFW
        if (message.attachments.size > 0) {
            const attachment = message.attachments.first();
            if (attachment.url.match(/\.(jpe?g|png|gif|bmp|webp)$/i)) {
                // Aquí puedes usar una librería de detección NSFW si tienes acceso a una API
                // Para efectos de ejemplo, asumimos que cualquier imagen puede ser NSFW
                try {
                    await message.delete();
                    console.log(`Imagen de ${member.user.tag} eliminada por ser NSFW.`);
                } catch (error) {
                    console.error(`No se pudo eliminar la imagen de ${member.user.tag}:`, error);
                }
                return;
            }
        }

        lastMessages.set(member.id, currentMessage);
    },
};
