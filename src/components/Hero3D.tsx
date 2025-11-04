import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Box, Torus, MeshDistortMaterial, Float } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

// Animated sphere component
function AnimatedSphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <Sphere args={[1, 100, 200]} scale={2.5} ref={meshRef} position={[0, 0, 0]}>
        <MeshDistortMaterial
          color="#5B8ADF"
          attach="material"
          distort={0.5}
          speed={2}
          roughness={0.1}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
}

// Rotating boxes
function FloatingBoxes() {
  const box1Ref = useRef<THREE.Mesh>(null);
  const box2Ref = useRef<THREE.Mesh>(null);
  const box3Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (box1Ref.current) {
      box1Ref.current.rotation.x = time * 0.5;
      box1Ref.current.rotation.y = time * 0.3;
      box1Ref.current.position.y = Math.sin(time * 0.5) * 0.5;
    }
    
    if (box2Ref.current) {
      box2Ref.current.rotation.x = time * 0.3;
      box2Ref.current.rotation.z = time * 0.4;
      box2Ref.current.position.y = Math.cos(time * 0.6) * 0.5;
    }
    
    if (box3Ref.current) {
      box3Ref.current.rotation.y = time * 0.4;
      box3Ref.current.rotation.z = time * 0.2;
      box3Ref.current.position.y = Math.sin(time * 0.7) * 0.5;
    }
  });

  return (
    <>
      <Box args={[0.8, 0.8, 0.8]} position={[-4, 0, -2]} ref={box1Ref}>
        <meshStandardMaterial color="#8B9CE8" metalness={0.8} roughness={0.2} />
      </Box>
      
      <Box args={[0.6, 0.6, 0.6]} position={[4, 1, -1]} ref={box2Ref}>
        <meshStandardMaterial color="#A78BFA" metalness={0.7} roughness={0.3} />
      </Box>
      
      <Box args={[0.5, 0.5, 0.5]} position={[-3, -2, 0]} ref={box3Ref}>
        <meshStandardMaterial color="#60A5FA" metalness={0.9} roughness={0.1} />
      </Box>
    </>
  );
}

// Floating toruses
function FloatingToruses() {
  const torus1Ref = useRef<THREE.Mesh>(null);
  const torus2Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (torus1Ref.current) {
      torus1Ref.current.rotation.x = time * 0.6;
      torus1Ref.current.rotation.y = time * 0.4;
      torus1Ref.current.position.x = Math.sin(time * 0.3) * 2;
    }
    
    if (torus2Ref.current) {
      torus2Ref.current.rotation.x = time * 0.4;
      torus2Ref.current.rotation.z = time * 0.5;
      torus2Ref.current.position.x = Math.cos(time * 0.4) * 2;
    }
  });

  return (
    <>
      <Torus args={[0.6, 0.2, 16, 100]} position={[3, -1, -3]} ref={torus1Ref}>
        <meshStandardMaterial color="#C084FC" metalness={0.8} roughness={0.2} />
      </Torus>
      
      <Torus args={[0.5, 0.15, 16, 100]} position={[-3, 2, -2]} ref={torus2Ref}>
        <meshStandardMaterial color="#818CF8" metalness={0.7} roughness={0.3} />
      </Torus>
    </>
  );
}

// Small floating spheres
function FloatingSpheres() {
  const sphere1Ref = useRef<THREE.Mesh>(null);
  const sphere2Ref = useRef<THREE.Mesh>(null);
  const sphere3Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (sphere1Ref.current) {
      sphere1Ref.current.position.y = Math.sin(time * 0.8) * 1.5 + 2;
      sphere1Ref.current.position.x = Math.cos(time * 0.5) * 3;
    }
    
    if (sphere2Ref.current) {
      sphere2Ref.current.position.y = Math.cos(time * 0.6) * 1.5 - 1;
      sphere2Ref.current.position.x = Math.sin(time * 0.7) * 3;
    }
    
    if (sphere3Ref.current) {
      sphere3Ref.current.position.y = Math.sin(time * 0.9) * 1.5;
      sphere3Ref.current.position.z = Math.cos(time * 0.6) * 2;
    }
  });

  return (
    <>
      <Sphere args={[0.3, 32, 32]} position={[2, 2, -4]} ref={sphere1Ref}>
        <meshStandardMaterial color="#7DD3FC" metalness={0.9} roughness={0.1} emissive="#7DD3FC" emissiveIntensity={0.2} />
      </Sphere>
      
      <Sphere args={[0.25, 32, 32]} position={[-2, -1, -3]} ref={sphere2Ref}>
        <meshStandardMaterial color="#F0ABFC" metalness={0.9} roughness={0.1} emissive="#F0ABFC" emissiveIntensity={0.2} />
      </Sphere>
      
      <Sphere args={[0.35, 32, 32]} position={[0, 1, -5]} ref={sphere3Ref}>
        <meshStandardMaterial color="#A5B4FC" metalness={0.9} roughness={0.1} emissive="#A5B4FC" emissiveIntensity={0.2} />
      </Sphere>
    </>
  );
}

// Floating particles
function Particles() {
  const count = 150;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 15;
  }

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#8B9CE8" transparent opacity={0.6} />
    </points>
  );
}

export const Hero3D = () => {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 8], fov: 75 }}>
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.8} color="#8B9CE8" />
        <pointLight position={[10, -10, -5]} intensity={0.6} color="#A78BFA" />
        <spotLight position={[0, 10, 0]} intensity={0.5} color="#60A5FA" angle={0.3} />
        
        {/* 3D Objects */}
        <AnimatedSphere />
        <FloatingBoxes />
        <FloatingToruses />
        <FloatingSpheres />
        <Particles />
        
        {/* Controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.3}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
};
