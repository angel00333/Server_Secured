module.exports = {
    name: 'work',
    description: 'Trabaja para ganar dinero.',
    execute(message, economy) {
        const user = message.author.id;
        if (!economy[user]) economy[user] = { wallet: 0, bank: 0 };
        const earned = Math.floor(Math.random() * 100) + 1; // Gana entre $1 y $100
        economy[user].wallet += earned;
        message.reply(`Has trabajado y ganado $${earned}. Tu nuevo balance en la billetera es: $${economy[user].wallet}`);
    },
};
