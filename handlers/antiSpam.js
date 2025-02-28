const { handleMessageReward } = require('./rewards');

const userMessageHistory = new Map();

module.exports = {
    handleSpam: async (message) => {
        const MAX_MESSAGES = 5;        // Máximo de mensajes en historial
        const REPEAT_LIMIT = 2;        // Límite de repeticiones para flood
        const TIME_LIMIT = 30000;      // Ventana de tiempo (30 segundos)
        const WARNING_DELETE_DELAY = 3000; // Borrar advertencia tras 3 segundos

        const member = message.member;
        const channel = message.channel;

        // Excluir administradores
        if (member && member.permissions.has('Administrator')) {
            await handleMessageReward(member, message);
            return;
        }

        // Detectar links (webs, invites de Discord, etc.)
        const detectLinks = (text) => {
            const patterns = [
                /(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?/gi, // URLs generales
                /discord\.(gg|com)\/(invite\/)?[a-zA-Z0-9]+/gi,        // Invitaciones Discord
                /(www\.)?[\w-]+\.(com|org|net|io|me|co|xyz)/gi        // Dominios comunes
            ];
            
            return patterns.some(pattern => pattern.test(text));
        };

        const hasLinks = detectLinks(message.content);
        const currentTime = Date.now();

        // Si contiene links, eliminar inmediatamente
        if (hasLinks) {
            try {
                await message.delete();
                console.log(`Mensaje con link de ${member.user.tag} eliminado: "${message.content}"`);

                const warningMessage = await channel.send({
                    content: `${member}, no se permiten links ni invitaciones en este canal.`,
                    allowedMentions: { users: [member.id] }
                });

                setTimeout(async () => {
                    try {
                        await warningMessage.delete();
                    } catch (error) {
                        console.error(`Error al eliminar advertencia:`, error);
                    }
                }, WARNING_DELETE_DELAY);

                return; // Salir tras eliminar el link
            } catch (error) {
                console.error(`Error al eliminar mensaje con link de ${member.user.tag}:`, error);
                return;
            }
        }

        // Normalizar texto para detectar flood (solo si no tiene links)
        const normalizeText = (text) => text.trim().toLowerCase().replace(/\s+/g, ' ');
        const messageContent = normalizeText(message.content);

        // Manejar historial de mensajes
        if (!userMessageHistory.has(member.id)) {
            userMessageHistory.set(member.id, []);
        }
        let userMessages = userMessageHistory.get(member.id);

        userMessages = userMessages.filter(
            (msg) => currentTime - msg.timestamp < TIME_LIMIT
        );

        const repeatCount = userMessages.filter(
            (msg) => msg.content === messageContent
        ).length;

        // Detectar flood de mensajes repetidos
        if (repeatCount >= REPEAT_LIMIT) {
            try {
                await message.delete();
                console.log(`Flood detectado de ${member.user.tag} eliminado (${repeatCount + 1} repeticiones)`);

                const warningMessage = await channel.send({
                    content: `${member}, por favor no repitas mensajes constantemente.`,
                    allowedMentions: { users: [member.id] }
                });

                setTimeout(async () => {
                    try {
                        await warningMessage.delete();
                    } catch (error) {
                        console.error(`Error al eliminar advertencia:`, error);
                    }
                }, WARNING_DELETE_DELAY);

                return;
            } catch (error) {
                console.error(`Error al eliminar mensaje de ${member.user.tag}:`, error);
                return;
            }
        }

        // Actualizar historial
        userMessages.push({
            content: messageContent,
            timestamp: currentTime
        });

        if (userMessages.length > MAX_MESSAGES) {
            userMessages.shift();
        }

        userMessageHistory.set(member.id, userMessages);

        // Procesar recompensa
        try {
            await handleMessageReward(member, message);
        } catch (error) {
            console.error(`Error en handleMessageReward para ${member.user.tag}:`, error);
        }
    }
};