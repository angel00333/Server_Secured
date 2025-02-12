const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'kick',
    description: 'Expulsa a un usuario del servidor.',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return message.reply('No tienes permisos para expulsar usuarios.');
        }

        const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!target) {
            return message.reply('Por favor, menciona a un usuario o proporciona su ID.');
        }

        if (!target.kickable) {
            return message.reply('No puedo expulsar a este usuario. Puede que tenga un rol más alto o permisos especiales.');
        }

        try {
            await target.send(`Has sido expulsado del servidor "${message.guild.name}".`).catch(() => console.log('No se pudo enviar un mensaje privado al usuario.'));
            await target.kick('Expulsado por un moderador.');
            message.reply(`El usuario ${target.user.tag} ha sido expulsado.`);
        } catch (error) {
            console.error('Error al expulsar al usuario:', error);
            message.reply('Hubo un error al expulsar al usuario.');
        }
    },
};
