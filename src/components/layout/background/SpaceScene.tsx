import { Cloud, Sparkles } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

import Planet from './Planet';

const SpaceScene = () => {
  return (
    <Canvas camera={{ position: [10, 3, 1] }} style={{ zIndex: 1 }}>
      <ambientLight intensity={1} />
      <pointLight position={[10, 10, 10]} />
      <Sparkles scale={100} count={99} size={10} color={'white'} />
      <Sparkles scale={100} count={99} size={10} color={'orange'} />
      <Sparkles scale={100} count={99} size={10} color={'pink'} />
      <Sparkles scale={100} count={99} size={10} color={'grey'} />
      <Sparkles scale={100} count={99} size={10} color={'white'} />
      <Sparkles scale={100} count={99} size={10} color={'orange'} />
      <Sparkles scale={100} count={99} size={10} color={'pink'} />
      <Sparkles scale={100} count={99} size={10} color={'grey'} />
      <Cloud
        volume={40}
        position={[-21, -10, 1]}
        opacity={0.1}
        color={'purple'}
        growth={5}
        speed={0.3}
      />
      <Cloud
        volume={250}
        position={[-500, 0, 5]}
        opacity={0.03}
        color={'orange'}
        segments={30}
        growth={10}
        speed={0.3}
      />
      <Cloud
        volume={300}
        position={[-250, -100, -35]}
        opacity={0.03}
        color={'red'}
        growth={10}
        segments={50}
        speed={0.6}
      />
      <Cloud
        volume={15}
        position={[-9, -1, 10]}
        opacity={0.1}
        color={'turquoise'}
        growth={2}
        speed={0.1}
      />
      <Planet position={[0, -3, 0]} />
    </Canvas>
  );
};

export default SpaceScene;
