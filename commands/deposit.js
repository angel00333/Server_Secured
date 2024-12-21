module.exports = {
    name: 'deposit',
    description: 'Deposita dinero de tu billetera al banco.',
    execute(message, args, economy) {
        const user = message.author.id;
        const amount = parseInt(args[0]);
        if (!economy[user]) economy[user] = { wallet: 0, bank: 0 };
        if (isNaN(amount) || amount <= 0) {
            return message.reply('Por favor, proporciona una cantidad válida para depositar.');
        }
        if (economy[user].wallet < amount) {
            return message.reply('No tienes suficiente dinero en la billetera para depositar.');
        }
        economy[user].wallet -= amount;
        economy[user].bank += amount;
        message.reply(`Has depositado $${amount}. Tu nuevo saldo es: Billetera: $${economy[user].wallet}, Banco: $${economy[user].bank}`);
    },
};
