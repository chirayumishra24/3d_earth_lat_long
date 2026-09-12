import * as THREE from 'three';

export const AtmosphereShaderMaterial = {
  uniforms: {
    glowColor: { value: new THREE.Color('#38BDF8') },
    viewVector: { value: new THREE.Vector3() },
    sunDirection: { value: new THREE.Vector3(8, 2, 6) },
    coef: { value: 0.8 },
    power: { value: 3.5 },
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vWorldNormal;
    varying vec3 vPosition;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vWorldNormal = normalize(mat3(modelMatrix) * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform vec3 glowColor;
    uniform float coef;
    uniform float power;
    uniform vec3 sunDirection;
    varying vec3 vNormal;
    varying vec3 vWorldNormal;
    varying vec3 vPosition;
    void main() {
      vec3 viewDir = normalize(vPosition);
      float rim = pow(coef - dot(vNormal, viewDir), power);
      rim = clamp(rim, 0.0, 1.0);
      float sunDot = dot(vWorldNormal, normalize(sunDirection));
      float dayFactor = smoothstep(-0.25, 0.35, sunDot);
      gl_FragColor = vec4(glowColor, rim * (dayFactor * 0.95 + 0.05));
    }
  `,
  side: THREE.BackSide,
  blending: THREE.AdditiveBlending,
  transparent: true,
  depthWrite: false,
};
