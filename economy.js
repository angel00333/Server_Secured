const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'economy.json');

// Cargar los datos desde el archivo JSON
const loadEconomy = () => {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify({}));
    }
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
};

// Guardar los datos en el archivo JSON
const saveEconomy = (data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
};

module.exports = {
    getEconomy: () => loadEconomy(),
    updateEconomy: (data) => saveEconomy(data),
};