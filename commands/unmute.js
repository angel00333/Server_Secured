module.exports = {
    name: 'unmute',
    description: 'Desmutea a un miembro previamente muteado.',
    async execute(message, args) {
        // Verificar si el usuario tiene el permiso para desmutear
        if (!message.member.permissions.has('MUTE_MEMBERS')) {
            return message.reply('No tienes permisos para usar este comando.');
        }

        // Obtener la mención del miembro
        const member = message.mentions.members.first();

        // Validar si se menciona a un miembro
        if (!member) {
            return message.reply('Por favor menciona al miembro que deseas desmutear.');
        }

        // Obtener el rol de mute (debe existir un rol "Muted")
        const muteRole = message.guild.roles.cache.find(role => role.name === 'Muted');
        if (!muteRole) {
            return message.reply('No se encuentra un rol de "Muted" en el servidor. Asegúrate de crearlo.');
        }

        // Verificar si el miembro tiene el rol de mute
        if (!member.roles.cache.has(muteRole.id)) {
            return message.reply(`${member.user.tag} no está muteado.`);
        }

        try {
            // Remover el rol de mute
            await member.roles.remove(muteRole);
            message.reply(`${member.user.tag} ha sido desmuteado.`);
        } catch (error) {
            console.error(error);
            message.reply('Hubo un error al intentar desmutear al miembro.');
        }
    },
};
