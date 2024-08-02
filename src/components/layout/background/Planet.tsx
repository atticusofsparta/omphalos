// src/Planet.js
import { Vector3, useFrame, useLoader } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

const Planet = ({ position }: { position: Vector3 }) => {
  const planetRef = useRef<any>();
  const planetTexture = useLoader(
    THREE.TextureLoader,
    'images/mars-texture.webp',
  );

  // Rotate the planet
  useFrame(() => {
    if (planetRef.current) {
      planetRef.current.rotation.y += 0.0004;
    }
  });

  return (
    <mesh ref={planetRef} position={position}>
      <sphereGeometry args={[3, 360, 360]} />
      <meshStandardMaterial map={planetTexture} />
    </mesh>
  );
};

export default Planet;
