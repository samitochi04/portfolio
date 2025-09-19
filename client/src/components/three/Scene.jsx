import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';

const Scene = ({ children, camera, ...props }) => {
  return (
    <Canvas
      camera={{ 
        position: [0, 0, 5], 
        fov: 75,
        ...camera 
      }}
      style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 10,
      }}
      {...props}
    >
      <Suspense fallback={null}>
        {children}
      </Suspense>
    </Canvas>
  );
};

export default Scene;