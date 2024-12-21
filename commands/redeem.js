const fs = require('fs');
const { getEconomy, updateEconomy } = require('../economy');

// Ruta del archivo de códigos
const codesFilePath = './codes.json';

module.exports = {
    name: 'redeem',
    description: 'Canjea un código por monedas',
    async execute(message, args) {
        const code = args[0]; // El código que el usuario intenta canjear

        if (!code) {
            return message.reply('Por favor, proporciona un código de canje.');
        }

        // Leer los códigos guardados en el archivo
        const codes = JSON.parse(fs.readFileSync(codesFilePath, 'utf-8'));

        // Verificar si el código existe y no ha sido usado
        if (!codes[code]) {
            return message.reply('Este código no es válido o ha expirado.');
        }

        const codeData = codes[code];

        if (codeData.used) {
            return message.reply('Este código ya ha sido canjeado.');
        }

        // Marcar el código como usado
        codes[code].used = true;
        fs.writeFileSync(codesFilePath, JSON.stringify(codes, null, 2));

        // Obtener la economía del usuario
        const economy = getEconomy();
        const userId = message.author.id;

        // Si el usuario no tiene una economía registrada, crearla
        if (!economy[userId]) {
            economy[userId] = { wallet: 0, bank: 0 };
        }

        // Otorgar las monedas al usuario
        economy[userId].wallet += codeData.reward;
        updateEconomy(economy);

        // Notificar al usuario que ha canjeado el código exitosamente
        message.reply(`¡Código canjeado exitosamente! Has recibido ${codeData.reward} monedas.`);
    },
};
