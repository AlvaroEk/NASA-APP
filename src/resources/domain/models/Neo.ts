export interface Neo {
  id: string;
  name: string;
  absolute_magnitude_h: number;
  is_potentially_hazardous_asteroid: boolean;
  estimated_diameter_km_min: number;
  estimated_diameter_km_max: number;
  velocity_kmh: string;
  miss_distance_km: string;
  close_approach_date: string;
}
