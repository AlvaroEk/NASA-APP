// Interfaz que representa un ítem de la API de NASA TechTransfer
// Se usa como modelo de dominio para estructurar la información de software disponible para transferencia

export interface TechTransfer {
  // Identificador único del software o tecnología
  id: string;

  // Título o nombre del software/tecnología
  title: string;

  // Descripción resumida del contenido o funcionalidad
  description: string;
}
