const axios = require('axios');
const GEMINI_API_KEY = 'AIzaSyBddsT7hu6mpnIf9nc22ow-TDl9sFGl2WY'; // ¡Guarda esto en una variable de entorno!

module.exports = {
    name: 'gemini',
    description: 'Responde preguntas usando la API gratuita de Gemini (Google AI).',
    async execute(message, args) {
        const question = args.join(' ').trim();

        if (!question) {
            return message.reply('❌ Por favor, escribe una pregunta después del comando.');
        }

        const processingMsg = await message.reply('🔍 Procesando tu pregunta...');

        try {
            const response = await getGeminiResponse(question);
            await processingMsg.edit(`**Pregunta:** ${question}\n**Respuesta:** ${response}`);
        } catch (error) {
            console.error('Error en Gemini API:', error.response?.data || error.message);
            await processingMsg.edit('❌ Error al procesar tu pregunta. ' + getErrorMessage(error));
        }
    },
};

async function getGeminiResponse(question) {
    // Usa el modelo gratuito disponible (Gemini 1.5 Flash o 1.0 Pro)
    const MODEL_NAME = 'gemini-1.5-flash'; // o 'gemini-1.0-pro' si falla
    const url = `https://generativelanguage.googleapis.com/v1/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

    const response = await axios.post(
        url,
        {
            contents: [{
                parts: [{ text: question }],
            }],
        },
        {
            headers: { 'Content-Type': 'application/json' },
            timeout: 15000, // 15 segundos máximo
        }
    );

    // Verifica la estructura de la respuesta
    if (!response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('La API no devolvió una respuesta válida.');
    }

    return response.data.candidates[0].content.parts[0].text;
}

function getErrorMessage(error) {
    if (error.response) {
        return `Código ${error.response.status}: ${error.response.data?.error?.message || 'Error desconocido'}`;
    } else if (error.code === 'ECONNABORTED') {
        return 'El servidor tardó demasiado en responder.';
    } else {
        return error.message || 'Error desconocido.';
    }
}