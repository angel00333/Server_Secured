const { PermissionsBitField } = require('discord.js');
const fs = require('fs');
const path = './users_strikes.json';

// Cargar los strikes desde el archivo
let strikes = {};
if (fs.existsSync(path)) {
    const data = fs.readFileSync(path, 'utf8');
    strikes = JSON.parse(data);
}

module.exports = {
    name: 'unstrike',
    description: 'Elimina una o más advertencias de un usuario.',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return message.reply('No tienes permisos para eliminar advertencias.');
        }

        const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!target) {
            return message.reply('Por favor, menciona a un usuario o proporciona su ID.');
        }

        const removeCount = parseInt(args[1]);
        if (isNaN(removeCount) || removeCount < 1) {
            return message.reply('Por favor, proporciona un número válido de advertencias a eliminar.');
        }

        if (!strikes[target.id]) {
            return message.reply('Este usuario no tiene advertencias registradas.');
        }

        strikes[target.id] = Math.max(0, strikes[target.id] - removeCount);
        if (strikes[target.id] === 0) {
            delete strikes[target.id];
        }

        fs.writeFileSync(path, JSON.stringify(strikes, null, 4));
        message.reply(`Se han eliminado ${removeCount} advertencia(s) de ${target.user.tag}. Advertencias restantes: ${strikes[target.id] || 0}`);
    },
};