const fs = require('fs');

const bagFilePath = './bag.json';

module.exports = {
    name: 'bag',
    description: 'Muestra los objetos en tu bolsa.',
    execute(message) {
        const userId = message.author.id;
        
        // Leer el archivo de la bolsa de objetos
        const bag = JSON.parse(fs.readFileSync(bagFilePath, 'utf-8'));

        if (!bag[userId] || bag[userId].length === 0) {
            return message.reply('Tu bolsa está vacía.');
        }

        const userBag = bag[userId];
        message.reply(`Tienes los siguientes objetos en tu bolsa: ${userBag.join(', ')}`);
    },
};
