import { Cloud } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const WasmMemoryVisualizer: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const [memory, setMemory] = useState(new WebAssembly.Memory({ initial: 1 }));

  useEffect(() => {
    if (!memory) {
      fetch(
        'https://arweave.net/W3jOoH9yd_6lP2eo4Lh1Cx58ZD1TDspunUVtwtbr77E',
      ).then(async (res) => {
        const buffer = await res.arrayBuffer();
        const wasmMemory = new WebAssembly.Memory({ initial: 1 });
        const uint8Memory = new Uint8Array(wasmMemory.buffer);
        const uint8Buffer = new Uint8Array(buffer);
        uint8Memory.set(uint8Buffer);
        setMemory(wasmMemory);
      });
      return;
    }

    const analyzeMemory = () => {
      const uint8Memory = new Uint8Array(memory.buffer);
      const segments = [];
      for (let i = 0; i < uint8Memory.length; i += 16) {
        segments.push({
          start: i,
          end: i + 15,
          color: new THREE.Color(
            `hsl(${(uint8Memory[i] / 255) * 360}, 100%, 50%)`,
          ),
        });
      }
      return segments;
    };

    const segments = analyzeMemory().slice(0, 1000 * Math.random());

    const group = new THREE.Group();

    segments.forEach((segment) => {
      const geometry = new THREE.SphereGeometry(0.5 * Math.random(), 64, 64);
      const mesh = new THREE.Mesh(
        geometry,
        new THREE.MeshBasicMaterial({ color: 0xd11ddf }),
      );
      //expand then contract
      const width = 100 * Math.random();
      mesh.scale.set(1, 1, 1);
      mesh.scale.set(1, 1, 1);
      mesh.position.set(
        (Math.random() - 0.5) * width,
        (Math.random() - 0.5) * width,
        (Math.random() - 0.5) * width,
      );

      mesh.position.set(
        (((Math.random() - 0.5) * width) / 3) * Math.random(),
        (((Math.random() - 0.5) * width) / 2) * Math.random(),
        (((Math.random() - 0.5) * width) / 2) * Math.random(),
      );
      group.add(mesh);
    });

    if (groupRef.current) {
      groupRef.current.clear();
      groupRef.current.add(group);
    }
  }, [memory]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.x = 0.5;
      groupRef.current.rotation.y += 0.01;
    }
  });

  return <group ref={groupRef} position={[0, 0, -35]} />;
};

const App: React.FC = () => {
  return (
    <Canvas className="rounded-full">
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Cloud
        scale={0.5}
        volume={15}
        color={'purple'}
        speed={1}
        opacity={0.02}
      />
      <Cloud
        scale={1.0}
        volume={15}
        color={'turquoise'}
        speed={1}
        opacity={0.05}
      />
      <Cloud
        scale={1.5}
        volume={15}
        color={'pink'}
        speed={1}
        opacity={0.05}
        position={[-0, -5, -10]}
      />
      <WasmMemoryVisualizer />
    </Canvas>
  );
};

export default App;
