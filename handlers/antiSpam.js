const { getEconomy, updateEconomy } = require('../economy');
const { handleMessageReward } = require('./rewards');

module.exports = {
    handleSpam: async (message) => {
        const FLOOD_THRESHOLD = 5; // Cantidad de mensajes similares permitidos
        const WARNING_LIMIT = 3; // Número de advertencias antes de tomar acciones
        const messageMap = new Map(); // Almacena los mensajes recientes de los usuarios
        const warnings = new Map(); // Rastrea las advertencias dadas a cada usuario

        const member = message.member;

        // Excluir administradores
        if (member.permissions.has('Administrator')) {
            return;
        }

        const normalize = (text) => text.trim().toLowerCase();
        const normalizedMessage = normalize(message.content);

        // Obtener historial del usuario
        if (!messageMap.has(member.id)) {
            messageMap.set(member.id, []);
        }
        const userMessages = messageMap.get(member.id);

        // Detectar mensajes repetidos verticalmente
        if (userMessages.includes(normalizedMessage)) {
            if (!warnings.has(member.id)) {
                warnings.set(member.id, 0);
            }

            // Incrementar advertencias
            const currentWarnings = warnings.get(member.id) + 1;
            warnings.set(member.id, currentWarnings);

            if (currentWarnings >= WARNING_LIMIT) {
                try {
                    await message.delete();
                    console.log(`Mensaje repetido de ${member.user.tag} eliminado tras advertencias.`);
                } catch (error) {
                    console.error(`No se pudo eliminar el mensaje de ${member.user.tag}:`, error);
                }

                // Limpiar advertencias si ya se eliminó el mensaje
                warnings.delete(member.id);
                return;
            }

            // Advertencia para el usuario
            message.reply(
                `⚠️ Por favor, evita enviar mensajes repetidos (${currentWarnings}/${WARNING_LIMIT} advertencias).`
            );
            return;
        }

        // Registrar el mensaje en el historial
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
