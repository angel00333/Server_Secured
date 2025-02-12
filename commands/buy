const fs = require('fs');
const { getEconomy, updateEconomy } = require('../economy');

const bagFilePath = './bag.json';

module.exports = {
    name: 'buy',
    description: 'Compra un objeto de la tienda.',
    async execute(message, args) {
        const userId = message.author.id;
        const economy = getEconomy();
        
        if (!economy[userId]) {
            return message.reply('No tienes una economía registrada. ¿Puedes reclamar tu recompensa diaria?');
        }

        const userEconomy = economy[userId];
        const item = args[0]; // Objeto que el usuario quiere comprar
        
        if (!item) {
            return message.reply('Por favor, proporciona el nombre del objeto que deseas comprar (Martillo o Reverseuno).');
        }

        // Comprobar el objeto y el costo
        let cost, itemName;
        if (item.toLowerCase() === 'martillo') {
            cost = 1500;
            itemName = 'Martillo';
            if (userEconomy.wallet < cost) {
                return message.reply('No tienes suficiente dinero para comprar el Martillo.');
            }
        } else if (item.toLowerCase() === 'reverseuno') {
            cost = 10;
            itemName = 'Reverseuno';
            if (userEconomy.gems < cost) {
                return message.reply('No tienes suficientes gemas para comprar Reverseuno.');
            }
        } else {
            return message.reply('El objeto que proporcionaste no es válido. Usa `Martillo` o `Reverseuno`.');
        }

        // Restar el costo de la economía
        if (itemName === 'Martillo') {
            userEconomy.wallet -= cost;
        } else if (itemName === 'Reverseuno') {
            userEconomy.gems -= cost;
        }

        // Leer el archivo de la bolsa de objetos
        const bag = JSON.parse(fs.readFileSync(bagFilePath, 'utf-8'));

        // Si el usuario no tiene una bolsa, crearla
        if (!bag[userId]) {
            bag[userId] = [];
        }

        // Agregar el objeto a la bolsa
        bag[userId].push(itemName);
        fs.writeFileSync(bagFilePath, JSON.stringify(bag, null, 2));

        updateEconomy(economy);

        message.reply(`¡Has comprado un ${itemName}! Ahora lo tienes en tu bolsa.`);
    },
};
