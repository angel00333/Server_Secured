module.exports = {
    name: 'mute',
    description: 'Mutea a un miembro durante un tiempo determinado en minutos, horas o días.',
    async execute(message, args) {
        // Verificar si el usuario tiene el permiso para mutear
        if (!message.member.permissions.has('MUTE_MEMBERS')) {
            return message.reply('No tienes permisos para usar este comando.');
        }

        // Obtener la mención del miembro y el tiempo de mute
        const member = message.mentions.members.first();
        const muteTime = args[1]; // El tiempo de mute
        const timeUnit = args[2]; // La unidad de tiempo (minutos, horas, días)

        // Validar si se menciona a un miembro
        if (!member) {
            return message.reply('Por favor menciona al miembro que deseas mutear.');
        }

        // Validar el tiempo
        if (!muteTime || isNaN(muteTime)) {
            return message.reply('Por favor, proporciona un tiempo válido.');
        }

        // Validar la unidad de tiempo
        if (!['min', 'hour', 'day'].includes(timeUnit)) {
            return message.reply('Por favor, especifica una unidad de tiempo válida: `min`, `hour` o `day`.');
        }

        // Obtener el rol de mute (debe existir un rol "Muted" previamente configurado)
        const muteRole = message.guild.roles.cache.find(role => role.name === 'Muted');
        if (!muteRole) {
            return message.reply('No se encuentra un rol de "Muted" en el servidor. Asegúrate de crearlo.');
        }

        try {
            // Asignar el rol de mute al miembro
            await member.roles.add(muteRole);
            message.reply(`${member.user.tag} ha sido muteado por ${muteTime} ${timeUnit}.`);

            // Calcular el tiempo total en milisegundos
            let muteDuration;
            if (timeUnit === 'min') {
                muteDuration = muteTime * 60000; // Minutos a milisegundos
            } else if (timeUnit === 'hour') {
                muteDuration = muteTime * 3600000; // Horas a milisegundos
            } else if (timeUnit === 'day') {
                muteDuration = muteTime * 86400000; // Días a milisegundos
            }

            // Configurar el temporizador para quitar el mute después del tiempo especificado
            setTimeout(async () => {
                await member.roles.remove(muteRole);
                message.channel.send(`${member.user.tag} ha sido desmuteado.`);
            }, muteDuration);
        } catch (error) {
            console.error(error);
            message.reply('Hubo un error al intentar mutear al miembro.');
        }
    },
};
