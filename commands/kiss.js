const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

// Cambiamos la ruta para que esté en la raíz del proyecto
const kissCountPath = path.join(__dirname, '..', 'kissCount.json');

// Tu clave de API de Giphy (reemplázala con tu clave real)
const giphyApiKey = 'CC1QWgglaj6N2hwO0B7z6UtW20UYAiGf';

module.exports = {
    name: 'kiss',
    description: 'Envía un beso virtual a alguien y guarda la cantidad de besos dados',
    async execute(message, args) {
        if (args.length === 0) {
            return message.reply('¿A quién quieres darle un beso? Especifica un usuario!');
        }

        const target = message.mentions.users.first();
        if (!target) {
            return message.reply('No encontré a ese usuario. ¿Seguro que lo mencionaste?');
        }

        // Leer el archivo JSON con los besos
        let kissData = {};
        if (fs.existsSync(kissCountPath)) {
            kissData = JSON.parse(fs.readFileSync(kissCountPath, 'utf8'));
        }

        // Incrementar el contador de besos
        const key = `${message.author.id}-${target.id}`;

        // Si el par de usuarios ya existe, sumamos los besos previos
        if (kissData[key]) {
            kissData[key] += 1;
        } else {
            kissData[key] = 1;
        }

        // Guardar el archivo JSON con los nuevos datos
        fs.writeFileSync(kissCountPath, JSON.stringify(kissData, null, 4));

        // Obtener un GIF aleatorio de Giphy
        try {
            const response = await axios.get(`https://api.giphy.com/v1/gifs/random`, {
                params: {
                    api_key: giphyApiKey,
                    tag: 'kiss',
                    rating: 'G'
                }
            });

            const gifUrl = response.data.data.images.original.url;

            // Crear el Embed con EmbedBuilder
            const kissMessageEmbed = new EmbedBuilder()
                .setColor('#ff69b4')  // Color rosa para el tema del beso
                .setTitle('¡Un Beso Virtual! 💋')
                .setDescription(`${message.author.username} y ${target.username} se unieron en un tierno beso, se han besado ${kissData[key]} veces.`)
                .setImage(gifUrl) // Añadir el GIF aleatorio
                .setFooter({ text: 'Besos virtuales para todos 😘' });

            // Enviar el mensaje con el embed
            message.channel.send({ embeds: [kissMessageEmbed] });

        } catch (error) {
            console.error('Error obteniendo GIF de Giphy:', error);
            message.channel.send('¡Hubo un error al obtener el GIF!');
        }
    }
};
