// Spherical & Geographical coordinate transformations and extensive global spatial database

export interface GeoLocation {
  name: string;
  country?: string;
  lat: number;
  lon: number;
  type: 'city' | 'country' | 'ocean' | 'sea' | 'landmark';
  radiusKm?: number;
  funFact?: string;
}

export const GLOBE_RADIUS = 2.0;
export const EARTH_RADIUS_KM = 6371;

/**
 * Converts Latitude and Longitude in degrees to 3D Cartesian coordinates on a sphere.
 */
export function latLonToVector3(lat: number, lon: number, radius = GLOBE_RADIUS): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return [x, y, z];
}

/**
 * Converts 3D Cartesian vector coordinates back to Latitude and Longitude in degrees.
 */
export function vector3ToLatLon(x: number, y: number, z: number): { lat: number; lon: number } {
  const radius = Math.sqrt(x * x + y * y + z * z);
  if (radius === 0) return { lat: 0, lon: 0 };

  const normY = Math.max(-1, Math.min(1, y / radius));
  const lat = 90 - Math.acos(normY) * (180 / Math.PI);

  let lon = (Math.atan2(z, -x) * (180 / Math.PI)) - 180;
  while (lon < -180) lon += 360;
  while (lon > 180) lon -= 360;

  return {
    lat: Number(lat.toFixed(2)),
    lon: Number(lon.toFixed(2)),
  };
}

/**
 * Calculates Great-Circle Distance (Haversine Formula) in km.
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(EARTH_RADIUS_KM * c);
}

/**
 * Calculates initial Great-Circle Bearing (0-360°).
 */
export function calculateBearing(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;

  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δλ = toRad(lon2 - lon1);

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

  const θ = Math.atan2(y, x);
  return (toDeg(θ) + 360) % 360;
}

/**
 * Formats coordinates into cardinal degrees representation.
 */
export function formatCoordinates(lat: number, lon: number): {
  latFormatted: string;
  lonFormatted: string;
  fullFormatted: string;
  latValue: string;
  latDir: 'N' | 'S';
  lonValue: string;
  lonDir: 'E' | 'W';
} {
  const latDir: 'N' | 'S' = lat >= 0 ? 'N' : 'S';
  const lonDir: 'E' | 'W' = lon >= 0 ? 'E' : 'W';
  const latAbs = Math.abs(lat).toFixed(2);
  const lonAbs = Math.abs(lon).toFixed(2);

  return {
    latFormatted: `${latAbs}° ${latDir}`,
    lonFormatted: `${lonAbs}° ${lonDir}`,
    fullFormatted: `${latAbs}° ${latDir}, ${lonAbs}° ${lonDir}`,
    latValue: latAbs,
    latDir,
    lonValue: lonAbs,
    lonDir,
  };
}

/**
 * Comprehensive Spatial Dataset: Countries, Regions, Major Oceans & Seas
 */
export const GLOBAL_LOCATIONS: GeoLocation[] = [
  // --- OCEANS & SEAS ---
  { name: 'North Pacific Ocean', lat: 25.0, lon: -160.0, type: 'ocean' },
  { name: 'South Pacific Ocean', lat: -25.0, lon: -130.0, type: 'ocean' },
  { name: 'North Atlantic Ocean', lat: 30.0, lon: -40.0, type: 'ocean' },
  { name: 'South Atlantic Ocean', lat: -25.0, lon: -15.0, type: 'ocean' },
  { name: 'Indian Ocean', lat: -15.0, lon: 75.0, type: 'ocean' },
  { name: 'Arctic Ocean', lat: 85.0, lon: 0.0, type: 'ocean' },
  { name: 'Southern Ocean (Antarctica)', lat: -65.0, lon: 0.0, type: 'ocean' },
  { name: 'Mediterranean Sea', lat: 35.0, lon: 18.0, type: 'sea' },
  { name: 'Caribbean Sea', lat: 15.0, lon: -75.0, type: 'sea' },
  { name: 'Arabian Sea', lat: 15.0, lon: 65.0, type: 'sea' },
  { name: 'Bay of Bengal', lat: 15.0, lon: 88.0, type: 'sea' },
  { name: 'South China Sea', lat: 12.0, lon: 114.0, type: 'sea' },
  { name: 'Coral Sea', lat: -18.0, lon: 155.0, type: 'sea' },
  { name: 'Gulf of Mexico', lat: 25.0, lon: -90.0, type: 'sea' },
  { name: 'Bering Sea', lat: 58.0, lon: -175.0, type: 'sea' },
  { name: 'Norwegian Sea', lat: 68.0, lon: 2.0, type: 'sea' },
  { name: 'Red Sea', lat: 20.0, lon: 38.0, type: 'sea' },
  { name: 'Black Sea', lat: 43.5, lon: 34.5, type: 'sea' },
  { name: 'Caspian Sea', lat: 42.0, lon: 50.0, type: 'sea' },
  { name: 'Baltic Sea', lat: 58.0, lon: 20.0, type: 'sea' },
  { name: 'Sea of Japan', lat: 40.0, lon: 135.0, type: 'sea' },
  { name: 'Tasman Sea', lat: -38.0, lon: 160.0, type: 'sea' },
  { name: 'Hudson Bay', lat: 60.0, lon: -85.0, type: 'sea' },
  { name: 'Lake Baikal (Siberia)', lat: 53.5, lon: 108.0, type: 'landmark' },

  // --- COUNTRIES & REGIONS ---
  // Asia
  { name: 'India', country: 'India', lat: 20.59, lon: 78.96, type: 'country', radiusKm: 1400 },
  { name: 'China', country: 'China', lat: 35.86, lon: 104.2, type: 'country', radiusKm: 2200 },
  { name: 'Russia (Siberia)', country: 'Russia', lat: 60.0, lon: 105.0, type: 'country', radiusKm: 3000 },
  { name: 'Russia (European)', country: 'Russia', lat: 56.0, lon: 40.0, type: 'country', radiusKm: 1500 },
  { name: 'Japan', country: 'Japan', lat: 36.2, lon: 138.25, type: 'country', radiusKm: 1000 },
  { name: 'Indonesia', country: 'Indonesia', lat: -0.79, lon: 113.92, type: 'country', radiusKm: 1800 },
  { name: 'Pakistan', country: 'Pakistan', lat: 30.38, lon: 69.35, type: 'country', radiusKm: 700 },
  { name: 'Bangladesh', country: 'Bangladesh', lat: 23.68, lon: 90.36, type: 'country', radiusKm: 400 },
  { name: 'Philippines', country: 'Philippines', lat: 12.88, lon: 121.77, type: 'country', radiusKm: 800 },
  { name: 'Vietnam', country: 'Vietnam', lat: 14.06, lon: 108.28, type: 'country', radiusKm: 800 },
  { name: 'Thailand', country: 'Thailand', lat: 15.87, lon: 100.99, type: 'country', radiusKm: 600 },
  { name: 'Mongolia', country: 'Mongolia', lat: 46.86, lon: 103.85, type: 'country', radiusKm: 900 },
  { name: 'Kazakhstan', country: 'Kazakhstan', lat: 48.02, lon: 66.92, type: 'country', radiusKm: 1200 },
  { name: 'Saudi Arabia', country: 'Saudi Arabia', lat: 23.89, lon: 45.08, type: 'country', radiusKm: 1000 },
  { name: 'Iran', country: 'Iran', lat: 32.43, lon: 53.69, type: 'country', radiusKm: 900 },
  { name: 'Turkey', country: 'Turkey', lat: 38.96, lon: 35.24, type: 'country', radiusKm: 700 },
  { name: 'South Korea', country: 'South Korea', lat: 35.91, lon: 127.77, type: 'country', radiusKm: 300 },
  { name: 'Malaysia', country: 'Malaysia', lat: 4.21, lon: 101.98, type: 'country', radiusKm: 600 },

  // Europe
  { name: 'United Kingdom', country: 'United Kingdom', lat: 55.38, lon: -3.44, type: 'country', radiusKm: 600 },
  { name: 'France', country: 'France', lat: 46.23, lon: 2.21, type: 'country', radiusKm: 600 },
  { name: 'Germany', country: 'Germany', lat: 51.17, lon: 10.45, type: 'country', radiusKm: 500 },
  { name: 'Spain', country: 'Spain', lat: 40.46, lon: -3.75, type: 'country', radiusKm: 600 },
  { name: 'Italy', country: 'Italy', lat: 41.87, lon: 12.57, type: 'country', radiusKm: 600 },
  { name: 'Norway', country: 'Norway', lat: 60.47, lon: 8.47, type: 'country', radiusKm: 800 },
  { name: 'Sweden', country: 'Sweden', lat: 60.13, lon: 18.64, type: 'country', radiusKm: 800 },
  { name: 'Finland', country: 'Finland', lat: 61.92, lon: 25.75, type: 'country', radiusKm: 600 },
  { name: 'Poland', country: 'Poland', lat: 51.92, lon: 19.15, type: 'country', radiusKm: 500 },
  { name: 'Ukraine', country: 'Ukraine', lat: 48.38, lon: 31.17, type: 'country', radiusKm: 700 },
  { name: 'Greece', country: 'Greece', lat: 39.07, lon: 21.82, type: 'country', radiusKm: 400 },
  { name: 'Iceland', country: 'Iceland', lat: 64.96, lon: -19.02, type: 'country', radiusKm: 400 },

  // North America
  { name: 'United States', country: 'United States', lat: 37.09, lon: -95.71, type: 'country', radiusKm: 2200 },
  { name: 'Canada', country: 'Canada', lat: 56.13, lon: -106.35, type: 'country', radiusKm: 2500 },
  { name: 'Mexico', country: 'Mexico', lat: 23.63, lon: -102.55, type: 'country', radiusKm: 1100 },
  { name: 'Greenland', country: 'Denmark', lat: 71.71, lon: -42.6, type: 'country', radiusKm: 1200 },
  { name: 'Cuba', country: 'Cuba', lat: 21.52, lon: -77.78, type: 'country', radiusKm: 500 },

  // South America
  { name: 'Brazil', country: 'Brazil', lat: -14.24, lon: -51.93, type: 'country', radiusKm: 1800 },
  { name: 'Argentina', country: 'Argentina', lat: -38.42, lon: -63.62, type: 'country', radiusKm: 1400 },
  { name: 'Colombia', country: 'Colombia', lat: 4.57, lon: -74.3, type: 'country', radiusKm: 700 },
  { name: 'Peru', country: 'Peru', lat: -9.19, lon: -75.02, type: 'country', radiusKm: 800 },
  { name: 'Chile', country: 'Chile', lat: -35.68, lon: -71.54, type: 'country', radiusKm: 1200 },
  { name: 'Ecuador', country: 'Ecuador', lat: -1.83, lon: -78.18, type: 'country', radiusKm: 400 },

  // Africa
  { name: 'Egypt', country: 'Egypt', lat: 26.82, lon: 30.8, type: 'country', radiusKm: 900 },
  { name: 'South Africa', country: 'South Africa', lat: -30.56, lon: 22.94, type: 'country', radiusKm: 900 },
  { name: 'Nigeria', country: 'Nigeria', lat: 9.08, lon: 8.68, type: 'country', radiusKm: 700 },
  { name: 'Kenya', country: 'Kenya', lat: -0.02, lon: 37.91, type: 'country', radiusKm: 600 },
  { name: 'Algeria', country: 'Algeria', lat: 28.03, lon: 1.66, type: 'country', radiusKm: 1100 },
  { name: 'DR Congo', country: 'DR Congo', lat: -4.04, lon: 21.76, type: 'country', radiusKm: 1000 },
  { name: 'Ethiopia', country: 'Ethiopia', lat: 9.15, lon: 40.49, type: 'country', radiusKm: 700 },
  { name: 'Madagascar', country: 'Madagascar', lat: -18.77, lon: 46.87, type: 'country', radiusKm: 700 },
  { name: 'Morocco', country: 'Morocco', lat: 31.79, lon: -7.09, type: 'country', radiusKm: 600 },

  // Oceania & Poles
  { name: 'Australia', country: 'Australia', lat: -25.27, lon: 133.78, type: 'country', radiusKm: 1900 },
  { name: 'New Zealand', country: 'New Zealand', lat: -40.9, lon: 174.89, type: 'country', radiusKm: 800 },
  { name: 'Papua New Guinea', country: 'Papua New Guinea', lat: -6.31, lon: 143.96, type: 'country', radiusKm: 600 },
  { name: 'Antarctica', country: 'Antarctica', lat: -82.86, lon: 135.0, type: 'country', radiusKm: 2500 },
  { name: 'North Pole', country: 'Arctic', lat: 90.0, lon: 0.0, type: 'landmark', radiusKm: 500 },
  { name: 'South Pole', country: 'Antarctica', lat: -90.0, lon: 0.0, type: 'landmark', radiusKm: 500 },
  { name: 'Null Island (0°, 0°)', country: 'Gulf of Guinea', lat: 0.0, lon: 0.0, type: 'landmark', radiusKm: 200 },

  // Key Cities
  { name: 'New Delhi', country: 'India', lat: 28.61, lon: 77.23, type: 'city' },
  { name: 'Mumbai', country: 'India', lat: 19.08, lon: 72.88, type: 'city' },
  { name: 'Tokyo', country: 'Japan', lat: 35.68, lon: 139.69, type: 'city' },
  { name: 'Beijing', country: 'China', lat: 39.9, lon: 116.4, type: 'city' },
  { name: 'Shanghai', country: 'China', lat: 31.23, lon: 121.47, type: 'city' },
  { name: 'London (Greenwich)', country: 'United Kingdom', lat: 51.48, lon: 0.0, type: 'city' },
  { name: 'Paris', country: 'France', lat: 48.86, lon: 2.35, type: 'city' },
  { name: 'New York City', country: 'United States', lat: 40.71, lon: -74.01, type: 'city' },
  { name: 'Los Angeles', country: 'United States', lat: 34.05, lon: -118.24, type: 'city' },
  { name: 'Moscow', country: 'Russia', lat: 55.75, lon: 37.62, type: 'city' },
  { name: 'Sydney', country: 'Australia', lat: -33.87, lon: 151.21, type: 'city' },
  { name: 'Cairo', country: 'Egypt', lat: 30.04, lon: 31.24, type: 'city' },
  { name: 'Rio de Janeiro', country: 'Brazil', lat: -22.91, lon: -43.17, type: 'city' },
  { name: 'Cape Town', country: 'South Africa', lat: -33.92, lon: 18.42, type: 'city' },
];

/**
 * Accurately finds the clicked location: Country, City, Landmark, or Ocean/Sea
 */
export function findNearestLocation(lat: number, lon: number): {
  location: GeoLocation;
  distanceKm: number;
  displayText: string;
  category: 'city' | 'country' | 'ocean' | 'sea' | 'landmark';
} {
  let closest = GLOBAL_LOCATIONS[0];
  let minDistance = Infinity;

  // 1. Check if point lands inside a known Country bounding radius
  const countries = GLOBAL_LOCATIONS.filter((l) => l.type === 'country' && l.radiusKm);
  for (const country of countries) {
    const dist = calculateHaversineDistance(lat, lon, country.lat, country.lon);
    if (dist <= (country.radiusKm || 1000) && dist < minDistance) {
      minDistance = dist;
      closest = country;
    }
  }

  // 2. If closer to a specific landmark/city under 400km, use the city name!
  const citiesAndLandmarks = GLOBAL_LOCATIONS.filter((l) => l.type === 'city' || l.type === 'landmark');
  for (const place of citiesAndLandmarks) {
    const dist = calculateHaversineDistance(lat, lon, place.lat, place.lon);
    if (dist < 400 && dist < minDistance) {
      minDistance = dist;
      closest = place;
    }
  }

  // 3. If no close landmass matched within bounding tolerance, check Oceans & Seas
  if (minDistance > 1800) {
    const waterBodies = GLOBAL_LOCATIONS.filter((l) => l.type === 'ocean' || l.type === 'sea');
    for (const water of waterBodies) {
      const dist = calculateHaversineDistance(lat, lon, water.lat, water.lon);
      if (dist < minDistance) {
        minDistance = dist;
        closest = water;
      }
    }
  }

  // Build clean display text
  let displayText = closest.name;
  if (closest.type === 'city' && closest.country) {
    displayText = `${closest.name}, ${closest.country}`;
  } else if (closest.type === 'country') {
    displayText = closest.name;
  } else if (closest.type === 'ocean' || closest.type === 'sea') {
    displayText = `🌊 ${closest.name}`;
  }

  return {
    location: closest,
    distanceKm: minDistance,
    displayText,
    category: closest.type,
  };
}
