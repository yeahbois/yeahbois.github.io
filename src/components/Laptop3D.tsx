// Laptop3D.tsx
import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

// Define the type for the theme
type Theme = 'light' | 'dark';

export const Laptop3D = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previousMousePosition, setPreviousMousePosition] = useState({ x: 0, y: 0 });
  const laptopRef = useRef<THREE.Group | null>(null);
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
    camera.position.set(0, 0, 5); // Adjusted camera position for a better view
    
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    rendererRef.current = renderer;
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Softer shadows
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0; // Adjusted exposure
    mountRef.current.appendChild(renderer.domElement);

    // Load 3D model with DRACOLoader for better performance
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      '/mac-draco.glb', // Path to your new MacBook model
      (gltf) => {
        const laptop = gltf.scene;
        laptopRef.current = laptop;

        // Scale and position the model
        const scale = window.innerWidth < 768 ? 0.08 : 0.1;
        laptop.scale.set(scale, scale, scale);
        laptop.position.set(0, -0.7, 0); // Lower the model
        laptop.rotation.y = -Math.PI / 4; // Initial rotation

        // Apply video texture to the screen
        const video = document.createElement('video');
        video.src = '/coding-video.mp4';
        video.loop = true;
        video.muted = true;
        video.crossOrigin = 'anonymous';
        video.playsInline = true;
        video.play();

        const texture = new THREE.VideoTexture(video);
        texture.flipY = false;
        texture.colorSpace = THREE.SRGBColorSpace;

        const screenMaterial = new THREE.MeshBasicMaterial({ map: texture });

        laptop.traverse((child) => {
          if (child instanceof THREE.Mesh && child.name.includes('Object_4')) {
            child.material = screenMaterial;
          }
        });

        scene.add(laptop);
      },
      undefined,
      (error) => {
        console.error('An error happened while loading the model:', error);
      }
    );

    // Enhanced lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.5); // Boosted ambient light
    scene.add(ambientLight);

    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0.8);
    scene.add(hemisphereLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
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

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      if (laptopRef.current) {
        if (!isDragging) {
          laptopRef.current.rotation.y += 0.001;
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
      const darkMaterial = new THREE.MeshStandardMaterial({ color: 0x4B4B4B, metalness: 0.5, roughness: 0.5 }); // Space Gray
      const silverMaterial = new THREE.MeshStandardMaterial({ color: 0xD3D3D3, metalness: 0.5, roughness: 0.5 }); // Silver

      laptopRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && !child.material.map) {
          child.material = theme === 'dark' ? silverMaterial : darkMaterial;
        }
      });
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
    
    rotationVelocity.current = { x: deltaY * 0.0005, y: deltaX * 0.0005 };
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
