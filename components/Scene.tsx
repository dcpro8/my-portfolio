import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { ScrollControls, useScroll, Environment, Text } from '@react-three/drei';
import * as THREE from 'three';
import { DimensionalVeil } from './DimensionalVeil';
import { CognitiveArtifacts } from './CognitiveArtifacts';

// Text.preload is not necessary here as we are loading fonts via Google Fonts in HTML
// and the Text component handles its own loading lifecycle.

const Experience: React.FC = () => {
  const scroll = useScroll();
  const { camera, size } = useThree();
  const isMobile = size.width <= 640;
  
  // Ref for the entire group to move based on scroll
  const worldRef = useRef<THREE.Group>(null);
  
  // Conscious Camera Logic
  useFrame((state, delta) => {
    if (!worldRef.current) return;

    // Continuous Smooth Scrolling Logic
    // Map scroll offset (0 to 1) continuously to the total depth (60 units)
    // The first artifact is at -5, the last is at -65, so a 60 unit shift spans them perfectly.
    const targetZ = scroll.offset * 60; 
    
    // Smooth damping for "expensive" feel
    worldRef.current.position.z = THREE.MathUtils.damp(
      worldRef.current.position.z, 
      targetZ, 
      4, // Smooth continuous damping
      delta
    );

    // Subtle breathing drift (Removed parallax mouse movement)
    const t = state.clock.elapsedTime;
    const driftX = Math.sin(t * 0.1) * 0.1;
    const driftY = Math.cos(t * 0.15) * 0.1;

    // Smoothly interpolate current camera position to target (drift only)
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, driftX, 2, delta);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, driftY, 2, delta);
    
    // Always look slightly ahead
    state.camera.lookAt(0, 0, -10); 
  });

  return (
    <>
      <group ref={worldRef}>
        <DimensionalVeil />
        <CognitiveArtifacts isMobile={isMobile} />
      </group>
      
      {/* 
        Removed Environment to drastically save memory and loading time on free tier.
        Using direct lighting instead for a clean, performant sci-fi look.
      */}

      {/* Lighting - Balanced & Bright for Silver Look */}
      <ambientLight intensity={1.0} color="#ffffff" />
      <directionalLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[-10, 10, -10]} intensity={1.0} color="#00f0ff" />
      <directionalLight position={[0, -10, 5]} intensity={0.8} color="#ffaaee" />
      
      {/* Fog to hide the end of the simulation and keep models isolated in context */}
      <fog attach="fog" args={['#010102', 5, 25]} />
    </>
  );
};

export const Scene: React.FC = () => {
  return (
    <ScrollControls pages={5} damping={0.4}>
      <Experience />
    </ScrollControls>
  );
};