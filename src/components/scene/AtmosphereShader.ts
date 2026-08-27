import * as THREE from 'three';

export const AtmosphereShaderMaterial = {
  uniforms: {
    glowColor: { value: new THREE.Color('#38BDF8') },
    viewVector: { value: new THREE.Vector3() },
    coef: { value: 0.8 },
    power: { value: 3.5 },
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform vec3 glowColor;
    uniform float coef;
    uniform float power;
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
      vec3 viewDir = normalize(vPosition);
      float intensity = pow(coef - dot(vNormal, viewDir), power);
      intensity = clamp(intensity, 0.0, 1.0);
      gl_FragColor = vec4(glowColor, intensity * 0.9);
    }
  `,
  side: THREE.BackSide,
  blending: THREE.AdditiveBlending,
  transparent: true,
  depthWrite: false,
};
