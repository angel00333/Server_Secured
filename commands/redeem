const fs = require('fs');
const { getEconomy, updateEconomy } = require('../economy');

// Ruta del archivo de códigos
const codesFilePath = './codes.json';

module.exports = {
    name: 'redeem',
    description: 'Canjea un código por monedas, gemas, o tokens de arcade',
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

        // Verificar si el código es de tipo 'all' y si el usuario ya lo ha canjeado
        if (!codeData.all && codeData.used >= codeData.maxUses) {
            return message.reply('Este código ha alcanzado el límite de usos.');
        }

        // Verificar si el usuario ya ha canjeado el código
        if (codeData.usedBy && codeData.usedBy.includes(message.author.id)) {
            return message.reply('Ya has canjeado este código.');
        }

        // Marcar el código como usado
        if (!codeData.all) {
            codeData.used++;
        }
        codeData.usedBy = codeData.usedBy || [];
        codeData.usedBy.push(message.author.id);
        fs.writeFileSync(codesFilePath, JSON.stringify(codes, null, 2));

        // Obtener la economía del usuario
        const economy = getEconomy();
        const userId = message.author.id;

        // Si el usuario no tiene una economía registrada, crearla
        if (!economy[userId]) {
            economy[userId] = { wallet: 0, gems: 0, arcadeTokens: 0 };
        }

        // Otorgar la recompensa según el tipo
        if (codeData.rewardType === 'wallet') {
            economy[userId].wallet += codeData.rewardAmount;
        } else if (codeData.rewardType === 'gems') {
            economy[userId].gems += codeData.rewardAmount;
        } else if (codeData.rewardType === 'arcadeTokens') {
            economy[userId].arcadeTokens += codeData.rewardAmount;
        }

        // Actualizar la economía
        updateEconomy(economy);

        // Notificar al usuario que ha canjeado el código exitosamente
        message.reply(`¡Código canjeado exitosamente! Has recibido **${codeData.rewardAmount} ${codeData.rewardType}**.`);
    },
};
