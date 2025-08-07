const axios = require('axios');
const GEMINI_API_KEY = 'AIzaSyBddsT7hu6mpnIf9nc22ow-TDl9sFGl2WY'; // ¡Recuerda proteger tu clave!

module.exports = {
    name: 'gemini',
    description: 'Responde preguntas usando la API de Gemini (Google AI).',
    async execute(message, args) {
        const question = args.join(' ').trim();

        if (!question) {
            return message.reply('❌ Por favor, escribe una pregunta después del comando.');
        }

        // Mensaje de "procesando" para evitar timeouts de Discord
        const processingMsg = await message.reply('🔍 Pensando...');

        try {
            const response = await getGeminiResponse(question);
            await processingMsg.edit(`**Pregunta:** ${question}\n**Respuesta:** ${response}`);
        } catch (error) {
            console.error('Error en la API de Gemini:', error);
            await processingMsg.edit('❌ Error al procesar tu pregunta. ' + getErrorMessage(error));
        }
    },
};

async function getGeminiResponse(question) {
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

    const response = await axios.post(
        url,
        {
            contents: [{
                parts: [{ text: question }],
            }],
        },
        {
            headers: { 'Content-Type': 'application/json' },
            timeout: 10000, // 10 segundos máximo de espera
        }
    );

    // Manejo de respuestas inesperadas
    if (!response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('La API no devolvió una respuesta válida.');
    }

    return response.data.candidates[0].content.parts[0].text;
}

function getErrorMessage(error) {
    if (error.response) {
        return `Código ${error.response.status}: ${error.response.data?.error?.message || 'Error desconocido'}`;
    } else if (error.request) {
        return 'La API no respondió (timeout).';
    } else {
        return error.message || 'Error interno.';
    }
}