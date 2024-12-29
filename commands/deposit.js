const { getEconomy, updateEconomy } = require('../economy');

module.exports = {
    name: 'deposit',
    description: 'Deposita dinero de tu billetera al banco.',
    execute(message, args) {
        const user = message.author.id;
        const economy = getEconomy();

        if (!economy[user]) economy[user] = { wallet: 0, bank: 0 };

        const amount = parseInt(args[0]);
        if (isNaN(amount) || amount <= 0) {
            return message.reply('Por favor, proporciona una cantidad válida para depositar.');
        }

        if (economy[user].wallet < amount) {
            return message.reply('No tienes suficientes monedas para depositar.');
        }

        economy[user].wallet -= amount;
        economy[user].bank += amount;

        updateEconomy(economy); 

        message.reply(`Has depositado <a:emoji_2:1321161015261397013>**${amount}** monedas.`);
    },
};
