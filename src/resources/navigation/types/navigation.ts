// Definimos un tipo con todas las rutas del Stack Navigator principal
// Esto permite tipar correctamente el uso de navegación y los parámetros que se pasan entre pantallas

export type RootStackParamList = {
  // Pantalla principal (contenedora de pestañas); no requiere parámetros
  Home: undefined;

  // Pantalla de detalle para imágenes de la NASA
  // Requiere 3 parámetros: URL de la imagen, título y descripción
  Detail: {
    imageUrl: string;
    title: string;
    description: string;
  };

  // Pantalla de detalle para información de asteroides
  // Requiere un objeto 'asteroid' (puede ser tipado mejor si se desea)
  AsteroidDetail: {
    asteroid: any;
  };
};
