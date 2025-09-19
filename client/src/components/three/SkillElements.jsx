import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Sphere, Torus, Octahedron, Text3D, Float } from '@react-three/drei';
import { SKILLS_CATEGORIES } from '../../lib/constants';

const SkillElement = ({ skill, position, hovered, onHover, onLeave }) => {
  const meshRef = useRef();
  const [clicked, setClicked] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Auto-rotate
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.7;
      
      // Scale on hover
      const targetScale = hovered ? 1.2 : 1;
      meshRef.current.scale.lerp({ x: targetScale, y: targetScale, z: targetScale }, delta * 5);
      
      // Click animation
      if (clicked) {
        meshRef.current.rotation.z += delta * 3;
      }
    }
  });

  const getGeometryByCategory = (category) => {
    switch (category) {
      case SKILLS_CATEGORIES.PROGRAMMING:
        return <Box args={[1, 1, 1]} />;
      case SKILLS_CATEGORIES.FRAMEWORKS:
        return <Octahedron args={[1]} />;
      case SKILLS_CATEGORIES.AI_ML:
        return <Sphere args={[0.8, 32, 32]} />;
      case SKILLS_CATEGORIES.DATABASES:
        return <Torus args={[0.8, 0.3, 16, 32]} />;
      default:
        return <Box args={[1, 1, 1]} />;
    }
  };

  const getColorByCategory = (category) => {
    switch (category) {
      case SKILLS_CATEGORIES.PROGRAMMING:
        return '#0066ff';
      case SKILLS_CATEGORIES.FRAMEWORKS:
        return '#10b981';
      case SKILLS_CATEGORIES.AI_ML:
        return '#8b5cf6';
      case SKILLS_CATEGORIES.DATABASES:
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  return (
    <Float speed={1} rotationIntensity={0.5} floatIntensity={0.2}>
      <group 
        position={position}
        onPointerEnter={() => onHover(skill.id)}
        onPointerLeave={onLeave}
        onClick={() => setClicked(!clicked)}
      >
        <mesh ref={meshRef}>
          {getGeometryByCategory(skill.category)}
          <meshStandardMaterial 
            color={getColorByCategory(skill.category)}
            metalness={0.7}
            roughness={0.2}
            emissive={hovered ? getColorByCategory(skill.category) : '#000000'}
            emissiveIntensity={hovered ? 0.2 : 0}
          />
        </mesh>
        
        {/* Skill name text */}
        {hovered && (
          <Text3D
            font="/fonts/helvetiker_regular.typeface.json"
            size={0.2}
            height={0.02}
            position={[0, -1.5, 0]}
            anchorX="center"
            anchorY="middle"
          >
            {skill.name}
            <meshStandardMaterial color="#ffffff" />
          </Text3D>
        )}
        
        {/* Skill level indicator */}
        <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.8, 1, 32]} />
          <meshBasicMaterial 
            color={getColorByCategory(skill.category)} 
            transparent 
            opacity={0.3} 
          />
        </mesh>
        
        {/* Level progress ring */}
        <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry 
            args={[0.8, 1, 32, 1, 0, (skill.level / 100) * Math.PI * 2]} 
          />
          <meshBasicMaterial color={getColorByCategory(skill.category)} />
        </mesh>
      </group>
    </Float>
  );
};

const SkillElements = ({ skills = [], visible = true }) => {
  const [hoveredSkill, setHoveredSkill] = useState(null);

  if (!visible) return null;

  // Arrange skills in a circular pattern
  const radius = 8;
  const angleStep = (Math.PI * 2) / skills.length;

  return (
    <group>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      {skills.map((skill, index) => {
        const angle = index * angleStep;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(index * 0.5) * 2; // Vary height
        
        return (
          <SkillElement
            key={skill.id}
            skill={skill}
            position={[x, y, z]}
            hovered={hoveredSkill === skill.id}
            onHover={setHoveredSkill}
            onLeave={() => setHoveredSkill(null)}
          />
        );
      })}
    </group>
  );
};

export default SkillElements;