// Función serverless de Vercel para manejar todas las peticiones API
const path = require('path');

// Configurar variables de entorno
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });

// Importar el servidor Express
const app = require('../backend/server');

// Exportar como función serverless de Vercel
module.exports = app;
