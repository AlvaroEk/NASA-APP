// Interfaz que representa un Near Earth Object (NEO)
// Es un modelo de dominio usado para estructurar los datos de asteroides obtenidos desde la NASA API

export interface Neo {
  // Identificador único del asteroide
  id: string;

  // Nombre del asteroide
  name: string;

  // Magnitud absoluta (brillo intrínseco del asteroide)
  absolute_magnitude_h: number;

  // Indica si el asteroide es potencialmente peligroso para la Tierra
  is_potentially_hazardous_asteroid: boolean;

  // Diámetro mínimo estimado en kilómetros
  estimated_diameter_km_min: number;

  // Diámetro máximo estimado en kilómetros
  estimated_diameter_km_max: number;

  // Velocidad relativa en km/h en el momento del acercamiento
  velocity_kmh: string;

  // Distancia de aproximación a la Tierra en kilómetros
  miss_distance_km: string;

  // Fecha del acercamiento más próximo a la Tierra
  close_approach_date: string;
}
