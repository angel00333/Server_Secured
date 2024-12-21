module.exports = (message, economy) => {
    const user = message.author.id;
    if (!economy[user]) economy[user] = { wallet: 0, bank: 0 };
    message.reply(`Tu billetera: $${economy[user].wallet}, Banco: $${economy[user].bank}`);
};
