import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import { PROJECTS, Project, openModal, modalState } from '../data/config';

interface ArtifactProps {
  project: Project;
  index: number;
  isMobile: boolean;
}

const Artifact: React.FC<ArtifactProps> = ({ project, index, isMobile }) => {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  // Listen to global modal close event to revert the active state
  useEffect(() => {
    const handleClose = () => setClicked(false);
    modalState.addEventListener('close', handleClose);
    return () => modalState.removeEventListener('close', handleClose);
  }, []);

  // Refs for text opacity animation
  const titleRef = useRef<any>(null);
  const descRef = useRef<any>(null);

  // Randomize oscillation phase
  const phase = index * 2.3;

  const isDesktop = !isMobile;

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Slow mathematical oscillation
    const t = state.clock.elapsedTime;

    // Rotation logic removed per user request to stop rotating
    // meshRef.current.rotation.x = Math.sin(t * 0.2 + phase) * 0.1;
    // meshRef.current.rotation.y += rotationSpeed;

    // Scale on hover only for desktop, click always still works
    const targetScale = clicked ? 1.4 : (isDesktop && hovered ? 1.2 : 1.0);
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 2);

    // Smooth Text Opacity
    if (titleRef.current) {
      titleRef.current.fillOpacity = THREE.MathUtils.lerp(
        titleRef.current.fillOpacity,
        clicked || (isDesktop && hovered) ? 1.0 : 0.6,
        delta * 5
      );
    }
    if (descRef.current) {
      descRef.current.fillOpacity = THREE.MathUtils.lerp(
        descRef.current.fillOpacity,
        clicked ? 1.0 : 0.0,
        delta * 5
      );
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    setClicked(true); // Keep glowing effect
    openModal(project.id); // Open global HTML modal
  };

  const position = isMobile
    ? [0, 0, -5 - index * 10] as [number, number, number]
    : project.coordinates;

  const infoPosition = isMobile ? [0, -2.5, 0] : [2.5, 0, 0];
  const textAnchorX = isMobile ? "center" : "left";
  const titleFontSize = isMobile ? 0.35 : 0.4;
  const categoryFontSize = isMobile ? 0.18 : 0.2;
  const descFontSize = isMobile ? 0.13 : 0.15;
  const descMaxWidth = isMobile ? 2.4 : 4;

  return (
    <group
      position={position}
      ref={meshRef}
      onPointerOver={() => isDesktop && setHovered(true)}
      onPointerOut={() => isDesktop && setHovered(false)}
      onClick={handleClick}
    >
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        {/* The Structure */}
        <mesh>
          {/* Alternating geometry types for visual interest */}
          {index % 2 === 0 ? (
            <icosahedronGeometry args={[1.5, 0]} />
          ) : (
            <octahedronGeometry args={[1.5, 0]} />
          )}

          {/* Performant Sci-Fi Material */}
          <meshStandardMaterial
            color={clicked ? "#00f0ff" : "#cbd5e1"}
            emissive={clicked ? "#00f0ff" : "#1e293b"}
            emissiveIntensity={clicked ? 0.8 : 0.2}
            metalness={0.9}
            roughness={0.15}
            wireframe={false}
          />
        </mesh>

        {/* Wireframe overlay for "engineered" look */}
        <mesh scale={[1.01, 1.01, 1.01]}>
          {index % 2 === 0 ? (
            <icosahedronGeometry args={[1.5, 0]} />
          ) : (
            <octahedronGeometry args={[1.5, 0]} />
          )}
          <meshBasicMaterial
            color="#ffffff"
            wireframe
            transparent
            opacity={0.05}
          />
        </mesh>
      </Float>

      {/* Condensing Information */}
      <group position={infoPosition}>
        {/* Title */}
        <Text
          ref={titleRef}
          fontSize={titleFontSize}
          color={clicked ? "#00f0ff" : "white"}
          anchorX={textAnchorX}
          anchorY="middle"
          fillOpacity={0.6} // Initial State
        >
          {project.title}
        </Text>

        {/* Category */}
        <Text
          position={[0, -0.4, 0]}
          fontSize={categoryFontSize}
          color={clicked ? "#38bdf8" : "#94a3b8"}
          anchorX={textAnchorX}
          anchorY="middle"
          letterSpacing={0.1}
        >
          {project.category}
        </Text>

        {/* Description - Emerges on hover */}
        <Text
          ref={descRef}
          position={[0, -0.75, 0]}
          fontSize={descFontSize}
          maxWidth={descMaxWidth}
          color="#cbd5e1"
          anchorX={textAnchorX}
          anchorY="top"
          fillOpacity={0} // Initial State
        >
          {project.description}
        </Text>
      </group>
    </group>
  );
};

interface CognitiveArtifactsProps {
  isMobile: boolean;
}

export const CognitiveArtifacts: React.FC<CognitiveArtifactsProps> = ({ isMobile }) => {
  return (
    <>
      {PROJECTS.map((project, index) => (
        <Artifact key={project.id} project={project} index={index} isMobile={isMobile} />
      ))}
    </>
  );
};