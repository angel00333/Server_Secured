const { getEconomy } = require('../economy');

module.exports = {
    name: 'wallet',
    description: 'Muestra el balance de tu billetera y banco.',
    execute(message) {
        const user = message.author.id;
        const economy = getEconomy();

        if (!economy[user]) economy[user] = { wallet: 0, bank: 0 };

        message.reply(`Tu billetera: $${economy[user].wallet}, Banco: $${economy[user].bank}`);
    },
};
