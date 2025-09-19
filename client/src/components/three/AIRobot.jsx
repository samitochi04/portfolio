import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Float, MeshWobbleMaterial } from '@react-three/drei';
import { useMouse } from '../../hooks';
import * as THREE from 'three';

const AIRobot = () => {
  const meshRef = useRef();
  const { mousePosition } = useMouse();
  
  // Convert mouse position to 3D space
  const targetPosition = useRef(new THREE.Vector3());
  
  useEffect(() => {
    if (mousePosition) {
      // Convert screen coordinates to 3D world coordinates
      const x = (mousePosition.x / window.innerWidth - 0.5) * 10;
      const y = -(mousePosition.y / window.innerHeight - 0.5) * 10;
      targetPosition.current.set(x, y, 0);
    }
  }, [mousePosition]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Smooth follow mouse movement
      meshRef.current.position.lerp(targetPosition.current, delta * 2);
      
      // Add floating animation
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime * 2) * 0.1;
      
      // Rotate based on movement
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={0.5}>
      <group ref={meshRef}>
        {/* Main body */}
        <Sphere args={[0.5, 32, 32]} position={[0, 0, 0]}>
          <MeshWobbleMaterial
            color="#0066ff"
            attach="material"
            factor={0.1}
            speed={2}
            roughness={0.1}
            metalness={0.8}
          />
        </Sphere>
        
        {/* Eyes */}
        <Sphere args={[0.1, 16, 16]} position={[-0.2, 0.1, 0.4]}>
          <meshStandardMaterial color="#ffffff" emissive="#00ffff" emissiveIntensity={0.5} />
        </Sphere>
        <Sphere args={[0.1, 16, 16]} position={[0.2, 0.1, 0.4]}>
          <meshStandardMaterial color="#ffffff" emissive="#00ffff" emissiveIntensity={0.5} />
        </Sphere>
        
        {/* Antenna */}
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
          <meshStandardMaterial color="#333333" metalness={0.9} />
        </mesh>
        
        {/* Antenna tip */}
        <Sphere args={[0.05, 16, 16]} position={[0, 0.8, 0]}>
          <meshStandardMaterial color="#ff0066" emissive="#ff0066" emissiveIntensity={0.3} />
        </Sphere>
        
        {/* Ambient light for the robot */}
        <pointLight position={[0, 0, 1]} intensity={0.5} color="#0066ff" />
      </group>
    </Float>
  );
};

export default AIRobot;