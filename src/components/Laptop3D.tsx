// Laptop3D.tsx
import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

// Define the type for the theme
type Theme = 'light' | 'dark';

export const Laptop3D = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previousMousePosition, setPreviousMousePosition] = useState({ x: 0, y: 0 });
  const laptopRef = useRef<THREE.Mesh | null>(null);
  const rotationVelocity = useRef({ x: 0.001, y: 0.005 }); // Slowed down for a more subtle effect
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const [theme, setTheme] = useState<Theme>('light');

  // Function to get the current theme
  const getTheme = (): Theme => {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  };

  useEffect(() => {
    // Set initial theme
    setTheme(getTheme());

    // Listen for theme changes
    const observer = new MutationObserver(() => {
      setTheme(getTheme());
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    const camera = new THREE.PerspectiveCamera(
      45, // Reduced FOV for less distortion
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1, 7); // Adjusted camera position for a better view
    
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    rendererRef.current = renderer;
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Softer shadows
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0; // Adjusted exposure
    mountRef.current.appendChild(renderer.domElement);

    // Create a placeholder cube
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xcccccc,
      metalness: 0.5,
      roughness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });
    const cube = new THREE.Mesh(geometry, material);
    laptopRef.current = cube;
    scene.add(cube);


    // Enhanced lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0.5);
    scene.add(hemisphereLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.7);
    pointLight.position.set(0, 5, 5);
    scene.add(pointLight);

    const rimLight = new THREE.DirectionalLight(0x93c5fd, 0.7); // Blueish rim light
    rimLight.position.set(-5, -5, -10);
    scene.add(rimLight);

    const spotLight = new THREE.SpotLight(0xffffff, 1.0, 20, Math.PI * 0.1, 0.5, 2);
    spotLight.position.set(0, 8, 5);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    scene.add(spotLight);

    const screenLight = new THREE.PointLight(0x0ea5e9, 0.8, 10);
    screenLight.position.set(0, 0, 2);
    scene.add(screenLight);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      if (laptopRef.current) {
        if (!isDragging) {
          laptopRef.current.rotation.y += rotationVelocity.current.y;
          laptopRef.current.rotation.x += rotationVelocity.current.x;
          
          rotationVelocity.current.x *= 0.98; // Dampen rotation
          rotationVelocity.current.y *= 0.98;
        }
      }
      
      renderer.render(scene, camera);
    };
    
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update laptop color based on theme
  useEffect(() => {
    if (laptopRef.current) {
      const darkMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 }); // Dark Gray
      const silverMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc }); // Silver

      laptopRef.current.material = theme === 'dark' ? silverMaterial : darkMaterial;
    }
  }, [theme]);

  // Mouse and touch events
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setPreviousMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !laptopRef.current) return;
    
    const deltaX = e.clientX - previousMousePosition.x;
    const deltaY = e.clientY - previousMousePosition.y;
    
    laptopRef.current.rotation.y += deltaX * 0.005;
    laptopRef.current.rotation.x += deltaY * 0.005;
    
    rotationVelocity.current = { x: deltaY * 0.0005, y: deltaX * 0.0005 };
    setPreviousMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setPreviousMousePosition({ 
      x: e.touches[0].clientX, 
      y: e.touches[0].clientY 
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !laptopRef.current) return;
    
    const deltaX = e.touches[0].clientX - previousMousePosition.x;
    const deltaY = e.touches[0].clientY - previousMousePosition.y;
    
    laptopRef.current.rotation.y += deltaX * 0.005;
    laptopRef.current.rotation.x += deltaY * 0.005;
    
    rotationVelocity.current = { x: deltaY * 0.0005, y: deltaX * .0005 };
    setPreviousMousePosition({ 
      x: e.touches[0].clientX, 
      y: e.touches[0].clientY 
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div 
      ref={mountRef} 
      className="w-full h-full cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'none' }} // Prevents default touch actions
    />
  );
};
