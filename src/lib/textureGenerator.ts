import * as THREE from 'three';

/**
 * Creates high-detail procedural fallback textures for Earth, Clouds, and Bump maps
 * in case external CDN textures are slow or offline.
 */

// Procedural Earth Day Texture with realistic continents, oceans, and biomes
export function generateProceduralEarthTexture(): THREE.CanvasTexture {
  const width = 2048;
  const height = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) return new THREE.CanvasTexture(canvas);

  // 1. Deep Ocean Base with gradient
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, height);
  oceanGrad.addColorStop(0, '#0d2b45'); // Arctic
  oceanGrad.addColorStop(0.2, '#083358');
  oceanGrad.addColorStop(0.5, '#05203c'); // Equator
  oceanGrad.addColorStop(0.8, '#083358');
  oceanGrad.addColorStop(1, '#0d2b45'); // Antarctic
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, width, height);

  // Helper to map Lat/Lon to canvas X, Y
  const toX = (lon: number) => ((lon + 180) / 360) * width;
  const toY = (lat: number) => ((90 - lat) / 180) * height;

  // 2. Draw continent landmass approximations
  ctx.fillStyle = '#2d5a27'; // Lush Green
  ctx.strokeStyle = '#1e3f1b';

  // Major continent shapes (Simplified polygon coordinates)
  const drawLand = (coords: [number, number][], color = '#2e6b35') => {
    ctx.fillStyle = color;
    ctx.beginPath();
    coords.forEach(([lat, lon], idx) => {
      const x = toX(lon);
      const y = toY(lat);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fill();
  };

  // Africa
  drawLand([
    [35, -5], [37, 10], [32, 32], [12, 43], [10, 51], [0, 42],
    [-25, 33], [-34, 18], [-20, 12], [5, 2], [14, -17], [28, -13], [35, -5]
  ], '#7a703d');

  // Europe
  drawLand([
    [36, -6], [43, -9], [50, -4], [58, 6], [70, 28], [60, 40],
    [45, 30], [40, 20], [38, 0], [36, -6]
  ], '#3a5f2d');

  // Asia
  drawLand([
    [70, 30], [75, 100], [70, 170], [60, 165], [40, 140], [25, 120],
    [10, 105], [20, 80], [25, 60], [40, 50], [55, 40], [70, 30]
  ], '#556b2f');

  // North America
  drawLand([
    [70, -165], [72, -95], [60, -65], [45, -60], [25, -80], [15, -90],
    [20, -105], [32, -117], [55, -135], [65, -168], [70, -165]
  ], '#426932');

  // South America
  drawLand([
    [12, -72], [10, -60], [-5, -35], [-23, -42], [-54, -68],
    [-45, -75], [-18, -70], [-5, -80], [5, -77], [12, -72]
  ], '#265828');

  // Australia
  drawLand([
    [-12, 130], [-15, 145], [-25, 153], [-38, 148], [-35, 115],
    [-22, 114], [-15, 124], [-12, 130]
  ], '#9c7a3c');

  // Antarctica
  drawLand([
    [-65, -180], [-65, 180], [-90, 180], [-90, -180]
  ], '#eef3f8');

  // Greenland
  drawLand([
    [60, -45], [75, -20], [83, -30], [80, -60], [65, -50], [60, -45]
  ], '#e8f0f8');

  // 3. Subtle Latitude bands / biome variations
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.fillRect(0, toY(66.5), width, toY(90) - toY(66.5)); // Arctic glow

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// Procedural Cloud Texture
export function generateProceduralCloudTexture(): THREE.CanvasTexture {
  const width = 1024;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = 'rgba(0,0,0,0)';
  ctx.fillRect(0, 0, width, height);

  // Cloud bands around equator & mid-latitudes
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * width;
    const latFactor = (Math.random() - 0.5) * 2; // -1 to 1
    const y = (height / 2) + latFactor * (height * 0.4);
    const radius = 10 + Math.random() * 40;

    const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
    grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.15)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}
