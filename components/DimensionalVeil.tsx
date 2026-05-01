import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import * as THREE from 'three';

// A custom shader material for the veil
// Creates a shifting, ambiguous grid/field
const VeilMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#3b82f6') },
    uDepth: { value: 0 },
    uBreath: { value: 0 }, // For the breath event
  },
  vertexShader: `
    uniform float uTime;
    uniform float uDepth;
    uniform float uBreath;
    varying vec2 vUv;
    varying float vElev;

    // Simplex noise function
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      vUv = uv;
      vec3 pos = position;
      
      // The "Reality Gradient" - noise frequency and amplitude increases slightly with depth
      float noiseFreq = 2.0 + (uDepth * 1.0); // Reduced from 4.0 to make it less chaotic
      float noiseAmp = 0.5 + (uDepth * 0.5);  // Reduced from 1.5 to keep the movement subtle
      
      // Movement
      float movement = uTime * 0.1;
      
      float elevation = snoise(vec2(pos.x * noiseFreq + movement, pos.y * noiseFreq)) * noiseAmp;
      
      // The Breath Event expansion
      pos += normal * uBreath * 2.0; 
      
      pos.z += elevation;
      vElev = elevation;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      
      // Point size varies by depth/elevation
      gl_PointSize = 2.0 + (elevation * 2.0); 
    }
  `,
  fragmentShader: `
    uniform vec3 uColor;
    varying float vElev;
    varying vec2 vUv;

    void main() {
      // Circular points
      float strength = distance(gl_PointCoord, vec2(0.5));
      strength = 1.0 - strength;
      strength = pow(strength, 3.0);
      
      // Fade out edges
      float alpha = strength * (0.3 + vElev * 0.2);
      
      // Ambiguous mixing
      vec3 finalColor = uColor + (vElev * 0.2);

      gl_FragColor = vec4(finalColor, alpha);
    }
  `
};

export const DimensionalVeil: React.FC = () => {
  const meshRef = useRef<THREE.Points>(null);
  const scroll = useScroll();
  
  const shaderMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('#4c1d95') }, // Deep violet/indigo
      uDepth: { value: 0 },
      uBreath: { value: 0 }
    },
    vertexShader: VeilMaterial.vertexShader,
    fragmentShader: VeilMaterial.fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }), []);

  useFrame((state) => {
    if (meshRef.current) {
      // Time update
      shaderMaterial.uniforms.uTime.value = state.clock.elapsedTime;
      
      // Reality Gradient: Feed scroll position into shader
      const depth = scroll.offset; // 0 to 1
      shaderMaterial.uniforms.uDepth.value = THREE.MathUtils.lerp(
        shaderMaterial.uniforms.uDepth.value,
        depth,
        0.1
      );

      // THE BREATH EVENT
      // Trigger at ~60% depth (0.6)
      // We use a gaussian-like curve to trigger it around 0.6
      const breathTrigger = Math.exp(-Math.pow((depth - 0.6) * 10.0, 2.0)); 
      shaderMaterial.uniforms.uBreath.value = THREE.MathUtils.lerp(
        shaderMaterial.uniforms.uBreath.value,
        breathTrigger * 0.5, // intensity
        0.05
      );
    }
  });

  return (
    <points ref={meshRef} position={[0, 0, -30]} rotation={[-Math.PI / 4, 0, 0]}>
      {/* 
        Massive plane to ensure it covers the field regardless of drift 
        Width: 100, Height: 150
      */}
      <planeGeometry args={[100, 150, 150, 150]} /> 
      <primitive object={shaderMaterial} />
    </points>
  );
};