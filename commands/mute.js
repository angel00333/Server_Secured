const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'mute', // Nombre del comando
    description: 'Mutea a un usuario por un tiempo específico.', // Descripción
    async execute(message, args) {
        // Verificar permisos del usuario que ejecuta el comando
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('No tienes permisos para usar este comando.');
        }

        // Verificar si se mencionó un usuario o se proporcionó un ID
        const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!target) {
            return message.reply('Por favor, menciona a un usuario o proporciona su ID.');
        }

        // Verificar si se proporcionó un tiempo válido
        const time = args[1];
        if (!time || isNaN(parseInt(time))) {
            return message.reply('Por favor, proporciona un tiempo válido (ejemplo: 10s, 5m, 1h, 2d).');
        }

        // Convertir el tiempo a milisegundos
        const timeMatch = time.match(/^(\d+)(s|m|h|d)$/);
        if (!timeMatch) {
            return message.reply('Formato de tiempo inválido. Usa segundos (s), minutos (m), horas (h) o días (d).');
        }

        const amount = parseInt(timeMatch[1]);
        const unit = timeMatch[2];
        let ms = 0;

        switch (unit) {
            case 's':
                ms = amount * 1000;
                break;
            case 'm':
                ms = amount * 1000 * 60;
                break;
            case 'h':
                ms = amount * 1000 * 60 * 60;
                break;
            case 'd':
                ms = amount * 1000 * 60 * 60 * 24;
                break;
        }

        // Verificar o crear el rol "Muteado"
        let muteRole = message.guild.roles.cache.find(role => role.name === 'Muteado');
        if (!muteRole) {
            try {
                muteRole = await message.guild.roles.create({
                    name: 'Muteado',
                    color: '#000000',
                    permissions: [], // Sin permisos
                });

                // Deshabilitar permisos de enviar mensajes en todos los canales
                message.guild.channels.cache.forEach(async (channel) => {
                    await channel.permissionOverwrites.edit(muteRole, {
                        SendMessages: false,
                        AddReactions: false,
                    });
                });

                message.reply('Rol "Muteado" creado automáticamente.');
            } catch (error) {
                console.error('Error al crear el rol Muteado:', error);
                return message.reply('Hubo un error al crear el rol Muteado.');
            }
        }

        // Mutea al usuario
        try {
            await target.roles.add(muteRole);
            message.reply(`¡${target.user.tag} ha sido muteado por ${time}!`);

            // Quitar el mute después del tiempo especificado
            setTimeout(async () => {
                await target.roles.remove(muteRole);
                message.channel.send(`¡${target.user.tag} ha sido desmuteado!`);
            }, ms);
        } catch (error) {
            console.error('Error al mutear al usuario:', error);
            message.reply('Hubo un error al mutear al usuario.');
        }
    },
};