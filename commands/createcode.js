const fs = require('fs');

// Ruta del archivo de códigos
const codesFilePath = './codes.json';

// Función para generar un código aleatorio
const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 10; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

// Función para crear un código de canje
module.exports = {
    name: 'createcode',
    description: 'Genera un código de canje por monedas, gemas o tokens de arcade',
    async execute(message, args) {
        // Verificar permisos de administrador
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.reply('¡No tienes permisos para crear códigos de canje!');
        }

        // Asegurarse de que se proporcionen los parámetros necesarios
        const rewardType = args[0]; // wallet, gems, arcadeTokens
        const rewardAmount = parseInt(args[1], 10); // cantidad de la recompensa
        const maxUses = parseInt(args[2], 10); // número máximo de usos
        const all = args[3]; // 'all' para uso ilimitado por usuario, 'no' para limitado

        // Validación de los parámetros
        if (!rewardType || !rewardAmount || isNaN(rewardAmount) || !maxUses || isNaN(maxUses) || !['all', 'no'].includes(all)) {
            return message.reply('Por favor, proporciona los parámetros correctamente: <rewardType> <rewardAmount> <maxUses> <all/no>');
        }

        // Asegurarse de que el rewardType es válido
        if (!['wallet', 'gems', 'arcadeTokens'].includes(rewardType)) {
            return message.reply('El tipo de recompensa debe ser uno de estos: wallet, gems, arcadeTokens.');
        }

        // Generar un código único
        const code = generateCode();

        // Leer los códigos existentes
        const codes = JSON.parse(fs.readFileSync(codesFilePath, 'utf-8'));

        // Verificar si el código ya existe
        if (codes[code]) {
            return message.reply('Este código ya existe, intenta generar uno nuevo.');
        }

        // Crear el nuevo código con los datos proporcionados
        codes[code] = {
            rewardType: rewardType,
            rewardAmount: rewardAmount,
            maxUses: maxUses,
            used: 0,
            all: all === 'all',
            usedBy: []
        };

        // Guardar los códigos actualizados en el archivo
        fs.writeFileSync(codesFilePath, JSON.stringify(codes, null, 2));

        // Enviar mensaje confirmando la creación del código
        message.reply(`¡Nuevo código de canje creado! Código: \`${code}\` Puedes canjearlo por **${rewardAmount} ${rewardType}**. Maximo de usos: ${maxUses}.`);
    },
};
