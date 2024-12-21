const { getEconomy, updateEconomy } = require('../economy');

module.exports = {
    name: 'withdraw',
    description: 'Retira dinero del banco a tu billetera.',
    execute(message, args) {
        const user = message.author.id;
        const economy = getEconomy();

        if (!economy[user]) economy[user] = { wallet: 0, bank: 0 };

        const amount = parseInt(args[0]);
        if (isNaN(amount) || amount <= 0) {
            return message.reply('Por favor, proporciona una cantidad válida para retirar.');
        }

        if (economy[user].bank < amount) {
            return message.reply('No tienes suficiente dinero en el banco para retirar.');
        }

        economy[user].bank -= amount;
        economy[user].wallet += amount;

        updateEconomy(economy); // Guardar los datos actualizados

        message.reply(`Has retirado $${amount}. Tu nuevo saldo es: Billetera: $${economy[user].wallet}, Banco: $${economy[user].bank}`);
    },
};
