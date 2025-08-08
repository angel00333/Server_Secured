const axios = require('axios');

// Reemplaza por tu clave real
const GEMINI_API_KEY = 'AIzaSyBddsT7hu6mpnIf9nc22ow-TDl9sFGl2WY';

module.exports = {
  name: 'gemini',
  description: 'Responde preguntas utilizando la API Gemini v1beta.',
  async execute(message, args) {
    const question = args.join(' ').trim();
    if (!question) return message.reply('Por favor, haz una pregunta.');

    try {
      const response = await getGeminiResponse(question);
      message.reply(`**Pregunta:** ${question}\n**Respuesta:** ${response}`);
    } catch (error) {
      console.error('Error al obtener una respuesta de Gemini:', error?.response?.data || error.message);
      message.reply('❌ Hubo un error al procesar tu pregunta. Intenta más tarde.');
    }
  },
};

async function getGeminiResponse(question) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

  const res = await axios.post(
    url,
    {
      contents: [
        {
          role: 'user',
          parts: [{ text: question }],
        },
      ],
    },
    {
      headers: { 'Content-Type': 'application/json' },
      timeout: 15000,
    }
  );

  const candidate = res.data?.candidates?.[0];
  if (!candidate) {
    throw new Error('La API devolvió una respuesta vacía o sin candidatos.');
  }

  const text = candidate.content?.parts?.[0]?.text;
  return text?.trim() || 'No pude generar una respuesta.';
}
