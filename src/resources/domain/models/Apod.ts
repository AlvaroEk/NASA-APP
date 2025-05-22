// Definimos una interfaz TypeScript que representa una imagen del día (APOD)
// Esta interfaz se usa como modelo de dominio para tipar datos obtenidos de la API de la NASA

export interface Apod {
  // Título de la imagen o video del día
  title: string;

  // Explicación detallada del contenido
  explanation: string;

  // URL al contenido multimedia (imagen o video)
  url: string;

  // Tipo de contenido: puede ser 'image' o 'video' (según la API)
  media_type: 'image' | 'video';
}
