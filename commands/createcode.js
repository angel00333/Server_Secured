const fs = require('fs');
const { getEconomy, updateEconomy } = require('../economy');

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
    name: 'createCode',
    description: 'Genera un código de canje por monedas',
    async execute(message) {
        // Verificar permisos de administrador
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.reply('¡No tienes permisos para crear códigos de canje!');
        }

        // Generar un código y asociarlo con una cantidad de monedas (ejemplo: 50 monedas)
        const code = generateCode();
        const reward = 50; // Número de monedas por código
        const codes = JSON.parse(fs.readFileSync(codesFilePath, 'utf-8'));

        // Verificar si ya existe el código, para evitar duplicados
        if (codes[code]) {
            return message.reply('Este código ya existe, intenta generar uno nuevo.');
        }

        // Agregar el código al archivo de códigos
        codes[code] = { reward, used: false };
        fs.writeFileSync(codesFilePath, JSON.stringify(codes, null, 2));

        // Enviar el código generado
        message.reply(`¡Nuevo código de canje creado! Código: \`${code}\` Puedes canjearlo por ${reward} monedas.`);
    },
};
