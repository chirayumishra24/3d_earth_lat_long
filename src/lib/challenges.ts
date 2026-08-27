// Curated challenge dataset for 3D Earth Coordinate Explorer

export interface Challenge {
  id: string;
  stage: 1 | 2;
  title: string;
  subtitle: string;
  prompt: string;
  targetLat: number;
  targetLon: number;
  toleranceKm: number;
  countryName: string;
  region: string;
  hints: string[];
  funFact: string;
  initialCameraLat?: number;
  initialCameraLon?: number;
}

export const CHALLENGES: Challenge[] = [
  // STAGE 1: BROAD COUNTRY / REGIONAL LOCATIONS
  {
    id: 'stage1-india',
    stage: 1,
    title: 'Find: India',
    subtitle: 'Stage 1 · Broad Regional Location',
    prompt: 'Locate the triangular subcontinent of India in South Asia.',
    targetLat: 20.59,
    targetLon: 78.96,
    toleranceKm: 1400,
    countryName: 'India',
    region: 'South Asia',
    hints: [
      'India is in the Eastern Hemisphere, north of the Equator.',
      'Look between the Arabian Sea to the west and the Bay of Bengal to the east.',
      'Check the 15°N to 30°N latitude band and around 70°E to 90°E longitude.'
    ],
    funFact: 'India spans nearly 30 degrees of longitude, stretching from 68°7\'E to 97°25\'E!',
  },
  {
    id: 'stage1-brazil',
    stage: 1,
    title: 'Find: Brazil',
    subtitle: 'Stage 1 · Broad Regional Location',
    prompt: 'Locate the largest country in South America, home to the Amazon rainforest.',
    targetLat: -14.24,
    targetLon: -51.93,
    toleranceKm: 1800,
    countryName: 'Brazil',
    region: 'South America',
    hints: [
      'Brazil is in the Western Hemisphere, mostly south of the Equator.',
      'The Equator runs right across the northern part of Brazil (near Macapá).',
      'Look between 40°W and 70°W longitude in South America.'
    ],
    funFact: 'Brazil is one of the few countries through which both the Equator and the Tropic of Capricorn pass.',
  },
  {
    id: 'stage1-australia',
    stage: 1,
    title: 'Find: Australia',
    subtitle: 'Stage 1 · Broad Regional Location',
    prompt: 'Find the island continent of Australia in the Southern Hemisphere.',
    targetLat: -25.27,
    targetLon: 133.78,
    toleranceKm: 1900,
    countryName: 'Australia',
    region: 'Oceania',
    hints: [
      'Australia lies entirely in the Southern and Eastern Hemispheres.',
      'The Tropic of Capricorn (23.5° S) passes straight through the middle of the continent.',
      'Look between longitudes 115°E and 150°E.'
    ],
    funFact: 'Because it is completely in the Southern Hemisphere, all latitudes in Australia are labeled with "S" (South).',
  },
  {
    id: 'stage1-egypt',
    stage: 1,
    title: 'Find: Egypt',
    subtitle: 'Stage 1 · Broad Regional Location',
    prompt: 'Find Egypt in Northeast Africa, where the Nile flows into the Mediterranean Sea.',
    targetLat: 26.82,
    targetLon: 30.80,
    toleranceKm: 900,
    countryName: 'Egypt',
    region: 'North Africa / Middle East',
    hints: [
      'Egypt is in Northeast Africa, bordering the Mediterranean and Red Seas.',
      'It sits north of the Equator, roughly between 22°N and 31.5°N.',
      'Follow the Prime Meridian eastward by about 30 degrees.'
    ],
    funFact: 'The ancient Egyptians were among the earliest astronomers to use celestial observations to align pyramids to the cardinal directions.',
  },
  {
    id: 'stage1-japan',
    stage: 1,
    title: 'Find: Japan',
    subtitle: 'Stage 1 · Broad Regional Location',
    prompt: 'Locate the volcanic island archipelago of Japan in East Asia.',
    targetLat: 36.20,
    targetLon: 138.25,
    toleranceKm: 1000,
    countryName: 'Japan',
    region: 'East Asia',
    hints: [
      'Japan is an island arc in the Northwest Pacific Ocean.',
      'It is located in the Northern Hemisphere (~30°N to 45°N) and far Eastern Hemisphere (~130°E to 145°E).',
      'Look east of the Korean Peninsula and mainland China.'
    ],
    funFact: 'Japan is known as the "Land of the Rising Sun" because it is among the easternmost major Asian nations to experience sunrise.',
  },

  // STAGE 2: PRECISE COORDINATES
  {
    id: 'stage2-newdelhi',
    stage: 2,
    title: 'Place marker at 28.6°N, 77.2°E',
    subtitle: 'Stage 2 · Exact Coordinate Precision',
    prompt: 'Navigate the marker precisely to latitude 28.61° North, longitude 77.23° East.',
    targetLat: 28.61,
    targetLon: 77.23,
    toleranceKm: 280,
    countryName: 'New Delhi, India',
    region: 'South Asia',
    hints: [
      'Latitude 28.6° N is north of the Tropic of Cancer (23.5° N).',
      'Longitude 77.2° E is roughly midway between 60°E and 90°E meridians.',
      'Turn on "Show Grid" to use the 15° graticule lines as reference steps.'
    ],
    funFact: 'You found New Delhi, the capital of India, situated along the banks of the Yamuna River.',
  },
  {
    id: 'stage2-greenwich',
    stage: 2,
    title: 'Place marker at 51.5°N, 0.0°E',
    subtitle: 'Stage 2 · Exact Coordinate Precision',
    prompt: 'Find the world’s reference baseline: latitude 51.48° North, longitude 0.00° (Prime Meridian).',
    targetLat: 51.48,
    targetLon: 0.0,
    toleranceKm: 250,
    countryName: 'Greenwich (London), UK',
    region: 'Western Europe',
    hints: [
      'The Prime Meridian is 0° Longitude. Turn on the Prime Meridian toggle line for a direct visual guide!',
      'Travel north from the Equator along the 0° cyan line past France into the UK.',
      'Look right around 51.5° N in the Thames estuary.'
    ],
    funFact: 'The Greenwich Meridian was adopted internationally in 1884 as the official zero-point for world time zones (GMT/UTC) and longitude!',
  },
  {
    id: 'stage2-quito',
    stage: 2,
    title: 'Place marker at 0.2°S, 78.5°W',
    subtitle: 'Stage 2 · Exact Coordinate Precision',
    prompt: 'Place the marker right near the Equator at 0.18° South, 78.47° West.',
    targetLat: -0.18,
    targetLon: -78.47,
    toleranceKm: 250,
    countryName: 'Quito, Ecuador',
    region: 'South America',
    hints: [
      'Turn on the Equator line (0° Lat) in amber. The target sits almost directly on it.',
      'Follow the equator west across the Atlantic into northwestern South America (Andes mountains).',
      'Look near 78.5° W in the Pacific coastal mountain spine.'
    ],
    funFact: 'Quito, Ecuador is the closest national capital to the Equator and the second-highest capital city in the world at 2,850 meters elevation.',
  },
  {
    id: 'stage2-tokyo',
    stage: 2,
    title: 'Place marker at 35.7°N, 139.7°E',
    subtitle: 'Stage 2 · Exact Coordinate Precision',
    prompt: 'Target coordinates: latitude 35.68° North, longitude 139.69° East.',
    targetLat: 35.68,
    targetLon: 139.69,
    toleranceKm: 260,
    countryName: 'Tokyo, Japan',
    region: 'East Asia',
    hints: [
      'Latitude ~36° N is about one-third of the way from the Equator to the North Pole.',
      'Longitude ~140° E is far in the Eastern Hemisphere, near the 135° and 150° grid lines.',
      'Position the pin on the main island of Honshu facing Tokyo Bay.'
    ],
    funFact: 'Tokyo is located at nearly the same latitude as Los Angeles (34°N) and Athens, Greece (38°N)!',
  },
  {
    id: 'stage2-sydney',
    stage: 2,
    title: 'Place marker at 33.9°S, 151.2°E',
    subtitle: 'Stage 2 · Exact Coordinate Precision',
    prompt: 'Find the famous harbor city at latitude 33.87° South, longitude 151.21° East.',
    targetLat: -33.87,
    targetLon: 151.21,
    toleranceKm: 280,
    countryName: 'Sydney, Australia',
    region: 'Oceania',
    hints: [
      'Negative or "S" latitude means you must look south of the Equator.',
      'Look on the southeastern coast of Australia facing the Tasman Sea.',
      'Longitude is just east of 150° E.'
    ],
    funFact: 'Sydney was established in 1788 at Sydney Cove, chosen specifically for its deep natural harbor.',
  },
];
