const axios = require('axios');

// Clave de la API de Gemini
const GEMINI_API_KEY = 'AIzaSyBddsT7hu6mpnIf9nc22ow-TDl9sFGl2WY';

module.exports = {
    name: 'gemini',
    description: 'Responde preguntas utilizando la API de Gemini.',
    async execute(message, args) {
        const question = args.join(' ');
        if (!question) {
            return message.reply('Por favor, haz una pregunta.');
        }

        try {
            const response = await getGeminiResponse(question);
            message.reply(`**Pregunta:** ${question}\n**Respuesta:** ${response}`);
        } catch (error) {
            console.error('Error al obtener la respuesta:', error.response ? error.response.data : error.message);
            message.reply('Hubo un error al procesar tu pregunta: ' + (error.response ? error.response.data.error.message : error.message));
        }
    },
};

async function getGeminiResponse(question) {
    // Usamos v1 y un modelo hipotéticamente válido para 2025
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    const response = await axios.post(
        url,
        {
            contents: [{
                parts: [{
                    text: question,
                }],
            }],
        },
        {
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );

    if (!response.data.candidates || !response.data.candidates.length) {
        throw new Error('No se encontraron respuestas en la API.');
    }

    return response.data.candidates[0].content.parts[0].text;
}