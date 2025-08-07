const axios = require('axios');

// Clave de la API de Gemini
const GEMINI_API_KEY = 'AIzaSyBddsT7hu6mpnIf9nc22ow-TDl9sFGl2WY';

module.exports = {
    name: 'gemini',
    description: 'Responde preguntas utilizando la API de Gemini.',
    async execute(message, args) {
        const question = args.join(' ').trim();
        if (!question) {
            return message.reply('Por favor, haz una pregunta.');
        }

        try {
            const response = await getGeminiResponse(question);
            message.reply(`**Pregunta:** ${question}\n**Respuesta:** ${response}`);
        } catch (error) {
            console.error('Error al obtener la respuesta:', error);
            message.reply('❌ Hubo un error al procesar tu pregunta. Intenta de nuevo.');
        }
    },
};

async function getGeminiResponse(question) {
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    const response = await axios.post(
        url,
        {
            contents: [{
                parts: [{ text: question }],
            }],
        },
        {
            headers: { 'Content-Type': 'application/json' },
            timeout: 15000 // 15 segundos máximo para evitar que se quede colgado
        }
    );

    // Validar respuesta segura
    if (!response.data?.candidates?.length) {
        return 'No pude encontrar una respuesta.';
    }

    const text = response.data.candidates[0]?.content?.parts?.[0]?.text;
    return text || 'No recibí texto de respuesta.';
}
