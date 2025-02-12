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
    name: 'strike',
    description: 'Da una advertencia a un usuario. Después de 3 advertencias, será expulsado.',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return message.reply('No tienes permisos para dar advertencias.');
        }

        const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!target) {
            return message.reply('Por favor, menciona a un usuario o proporciona su ID.');
        }

        const reason = args.slice(1).join(' ') || 'No se proporcionó una razón.';
        
        if (!strikes[target.id]) {
            strikes[target.id] = 0;
        }

        strikes[target.id] += 1;
        fs.writeFileSync(path, JSON.stringify(strikes, null, 4));

        const strikeCount = strikes[target.id];
        message.reply(`El usuario ${target.user.tag} ha sido advertido ${strikeCount}/3. Razón: ${reason}`);

        if (strikeCount >= 3) {
            try {
                await target.kick(`Expulsado por acumular 3 advertencias. Razón: ${reason}`);
                message.reply(`¡${target.user.tag} ha sido expulsado por acumular 3 advertencias!`);
                delete strikes[target.id];
                fs.writeFileSync(path, JSON.stringify(strikes, null, 4));
            } catch (error) {
                console.error('Error al expulsar al usuario:', error);
                message.reply('Hubo un error al expulsar al usuario.');
            }
        }
    },
};
