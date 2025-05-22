// Este archivo configura Babel, el compilador de JavaScript que transforma el código
// antes de que lo entienda React Native (o Expo en este caso)

// Exportamos una función que recibe la API de configuración de Babel
module.exports = function (api) {
  // Habilita el cacheo para mejorar el rendimiento en recompilaciones
  api.cache(true);

  // Devolvemos un objeto con la configuración de Babel
  return {
    // 📦 Preset recomendado para apps con Expo
    presets: ['babel-preset-expo'],

    // 🔌 Lista de plugins adicionales
    plugins: [
      [
        // Plugin para importar variables de entorno desde un archivo .env
        'module:react-native-dotenv',
        {
          moduleName: '@env', // Nombre desde el cual se importan las variables (ej: import { NASA_API_KEY } from '@env';)
          path: '.env',       // Ruta al archivo que contiene las variables de entorno
        },
      ],
    ],
  };
};
