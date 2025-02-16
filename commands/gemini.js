const axios = require('axios'); // Necesitarás axios para hacer solicitudes HTTP

// Clave de la API de Gemini
const GEMINI_API_KEY = 'AIzaSyBddsT7hu6mpnIf9nc22ow-TDl9sFGl2WY';

module.exports = {
    name: 'gemini', // Nombre del comando
    description: 'Responde preguntas utilizando la API de Gemini.', // Descripción
    async execute(message, args) {
        // Verificar si se proporcionó una pregunta
        const question = args.join(' ');
        if (!question) {
            return message.reply('Por favor, haz una pregunta.');
        }

        try {
            // Obtener la respuesta de la API de Gemini
            const response = await getGeminiResponse(question);

            // Responder con la respuesta de Gemini
            message.reply(`**Pregunta:** ${question}\n**Respuesta:** ${response}`);
        } catch (error) {
            console.error('Error al obtener la respuesta:', error);
            message.reply('Hubo un error al procesar tu pregunta.');
        }
    },
};

// Función para obtener la respuesta de la API de Gemini
async function getGeminiResponse(question) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

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

    // Extraer y devolver la respuesta
    return response.data.candidates[0].content.parts[0].text;
}