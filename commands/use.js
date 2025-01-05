const fs = require('fs');
const { getEconomy, updateEconomy } = require('../economy');

const bagFilePath = './bag.json';

module.exports = {
    name: 'use',
    description: 'Usa un objeto de tu bolsa.',
    async execute(message, args) {
        const userId = message.author.id;
        const economy = getEconomy();
        const item = args[0]; // Objeto que el usuario quiere usar

        // Leer el archivo de la bolsa de objetos
        const bag = JSON.parse(fs.readFileSync(bagFilePath, 'utf-8'));

        // Verificar si el usuario tiene una bolsa
        if (!bag[userId] || bag[userId].length === 0) {
            return message.reply('No tienes objetos en tu bolsa.');
        }

        if (!item) {
            return message.reply('Por favor, especifica el objeto que quieres usar. Ejemplo: `!use martillo`.');
        }

        // Usar Martillo para robar
        if (item.toLowerCase() === 'martillo' && bag[userId].includes('Martillo')) {
            const targetUser = message.mentions.users.first();
            if (!targetUser) {
                return message.reply('Por favor, menciona a un usuario a quien robar.');
            }

            // Lógica de robo: Reducir dinero del usuario objetivo y agregarlo al que usa el martillo
            const targetId = targetUser.id;
            const targetEconomy = economy[targetId] || { wallet: 0 };

            const amountToSteal = Math.floor(Math.random() * 500) + 100; // Cantidad aleatoria entre 100 y 500
            if (targetEconomy.wallet < amountToSteal) {
                return message.reply(`${targetUser.username} no tiene suficiente dinero para robar.`);
            }

            targetEconomy.wallet -= amountToSteal;
            economy[userId].wallet += amountToSteal;
            // Eliminar Martillo de la bolsa del usuario
            bag[userId] = bag[userId].filter(item => item !== 'Martillo');

            fs.writeFileSync(bagFilePath, JSON.stringify(bag, null, 2));
            updateEconomy(economy);
            return message.reply(`¡Has robado ${amountToSteal} monedas a ${targetUser.username}!`);
        }

        // Usar Reverseuno para devolver martillazo
        if (item.toLowerCase() === 'reverseuno' && bag[userId].includes('Reverseuno')) {
            bag[userId] = bag[userId].filter(item => item !== 'Reverseuno');
            fs.writeFileSync(bagFilePath, JSON.stringify(bag, null, 2));
            updateEconomy(economy);
            return message.reply('Has devuelto un martillazo con Reverseuno.');
        }

        return message.reply('No tienes ese objeto o no puedes usarlo.');
    },
};
