import { Suspense, lazy } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

// Floating particle with smooth motion
const Particle = ({ position, color, delay = 0 }: { position: [number, number, number]; color: string; delay?: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime + delay;
      meshRef.current.position.x = position[0] + Math.sin(time * 0.5) * 0.3;
      meshRef.current.position.y = position[1] + Math.cos(time * 0.7) * 0.3;
      meshRef.current.position.z = position[2] + Math.sin(time * 0.4) * 0.2;
      meshRef.current.rotation.x = time * 0.5;
      meshRef.current.rotation.y = time * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.12, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.6}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
};

// Rotating torus ring
const RotatingRing = ({ radius, color, rotationSpeed, delay = 0 }: { radius: number; color: string; rotationSpeed: number; delay?: number }) => {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      const time = state.clock.elapsedTime + delay;
      ringRef.current.rotation.x = time * rotationSpeed;
      ringRef.current.rotation.y = time * rotationSpeed * 0.7;
      ringRef.current.rotation.z = time * rotationSpeed * 0.5;
    }
  });

  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[radius, 0.03, 16, 100]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.7}
        metalness={0.9}
        roughness={0.1}
      />
    </mesh>
  );
};

// Central core with pulsing effect
const CentralCore = () => {
  const coreRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (coreRef.current && innerRef.current) {
      const time = state.clock.elapsedTime;
      coreRef.current.rotation.x = time * 0.4;
      coreRef.current.rotation.y = time * 0.6;
      innerRef.current.rotation.x = -time * 0.3;
      innerRef.current.rotation.y = -time * 0.5;
      
      const pulse = 1 + Math.sin(time * 2) * 0.15;
      innerRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group>
      <mesh ref={innerRef}>
        <octahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial
          color="#64ffda"
          emissive="#64ffda"
          emissiveIntensity={1}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      <mesh ref={coreRef}>
        <dodecahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial
          color="#ff6b6b"
          emissive="#ff6b6b"
          emissiveIntensity={0.8}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  );
};

// Main 3D scene
const Scene3D = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.25;
    }
  });

  // Create particles in a balanced arrangement
  const particles: Array<{ pos: [number, number, number]; color: string; delay: number }> = [
    { pos: [-1.5, 1.5, 0], color: '#ff6b6b', delay: 0 },
    { pos: [1.5, 1.5, 0], color: '#64ffda', delay: 0.5 },
    { pos: [-1.5, -1.5, 0], color: '#64ffda', delay: 1 },
    { pos: [1.5, -1.5, 0], color: '#ff6b6b', delay: 1.5 },
    { pos: [0, 2, 0], color: '#ff6b6b', delay: 0.25 },
    { pos: [0, -2, 0], color: '#64ffda', delay: 0.75 },
    { pos: [-2, 0, 0], color: '#64ffda', delay: 1.25 },
    { pos: [2, 0, 0], color: '#ff6b6b', delay: 1.75 },
    { pos: [-1, 1, 1.2], color: '#ff6b6b', delay: 0.3 },
    { pos: [1, 1, 1.2], color: '#64ffda', delay: 0.8 },
    { pos: [-1, -1, -1.2], color: '#64ffda', delay: 1.3 },
    { pos: [1, -1, -1.2], color: '#ff6b6b', delay: 1.8 },
  ];

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.7} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#64ffda" />
      <pointLight position={[-5, -5, -5]} intensity={0.8} color="#ff6b6b" />
      <directionalLight position={[0, 5, 0]} intensity={0.5} />
      
      {/* Central core */}
      <CentralCore />
      
      {/* Rotating rings */}
      <RotatingRing radius={1.8} color="#64ffda" rotationSpeed={0.3} delay={0} />
      <RotatingRing radius={2.2} color="#ff6b6b" rotationSpeed={-0.25} delay={0.5} />
      
      {/* Floating particles */}
      {particles.map((particle, index) => (
        <Particle
          key={index}
          position={particle.pos}
          color={particle.color}
          delay={particle.delay}
        />
      ))}
    </group>
  );
};

const Scene3DComponent = () => (
  <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
    <Scene3D />
    <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} enablePan={false} />
  </Canvas>
);

const Lazy3DScene = lazy(() => Promise.resolve({ default: Scene3DComponent }));

const Hero3D = () => {
  return (
    <div className="w-full h-64 md:h-96 relative">
      <Suspense fallback={
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-crimson-accent/20 animate-pulse border-2 border-crimson-accent/50"></div>
        </div>
      }>
        <Lazy3DScene />
      </Suspense>
    </div>
  );
};

export default Hero3D;

