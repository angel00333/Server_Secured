const { getEconomy, updateEconomy } = require('../economy');

module.exports = {
    name: 'work',
    description: 'Trabaja para ganar dinero.',
    execute(message) {
        const user = message.author.id;
        const economy = getEconomy();

        if (!economy[user]) economy[user] = { wallet: 0, bank: 0 };
        const earned = Math.floor(Math.random() * 100) + 1; // Gana entre $1 y $100
        economy[user].wallet += earned;

        updateEconomy(economy); // Guardar los datos actualizados

        message.reply(`Has trabajado y ganado $${earned}.`);
    },
};
