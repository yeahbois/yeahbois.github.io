// Laptop3D.tsx
import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

export const Laptop3D = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previousMousePosition, setPreviousMousePosition] = useState({ x: 0, y: 0 });
  const laptopRef = useRef<THREE.Group | null>(null);
  const rotationVelocity = useRef({ x: 0, y: 0.005 });
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const starsRef = useRef<THREE.Points | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    rendererRef.current = renderer;
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mountRef.current.appendChild(renderer.domElement);

    // Create starfield background that fills only the laptop section
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.5,
      transparent: true,
      opacity: 0.8
    });
    
    const starsVertices = [];
    // Increase the number of stars and their range
    for (let i = 0; i < 20000; i++) {
      const x = (Math.random() - 0.5) * 4000;
      const y = (Math.random() - 0.5) * 4000;
      const z = (Math.random() - 0.5) * 4000;
      starsVertices.push(x, y, z);
    }
    
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    starsRef.current = stars;
    scene.add(stars);

    // Create laptop group
    const laptop = new THREE.Group();
    laptopRef.current = laptop;
    scene.add(laptop);

    // MacBook silver materials
    const silverMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xd8d8d8, // Silver color
      metalness: 0.9,
      roughness: 0.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1
    });

    const darkSilverMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xa8a8a8, // Darker silver for contrast
      metalness: 0.9,
      roughness: 0.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1
    });

    const screenMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x000000,
      metalness: 0.1,
      roughness: 0.1,
      emissive: 0x0ea5e9, // Blue emissive color
      emissiveIntensity: 0.2
    });

    const keyboardMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x333333, // Dark keys
      metalness: 0.2,
      roughness: 0.8
    });

    const keyMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf0f0f0, // Light silver keys
      metalness: 0.3,
      roughness: 0.4
    });

    const speakerMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x888888, // Darker silver for speakers
      metalness: 0.8,
      roughness: 0.2
    });

    // Create MacBook base (keyboard area) - Thinner and more elegant
    const baseGeometry = new THREE.BoxGeometry(10, 0.3, 6.5);
    const base = new THREE.Mesh(baseGeometry, silverMaterial);
    base.castShadow = true;
    base.receiveShadow = true;
    laptop.add(base);

    // Add rounded corners to the base
    const cornerRadius = 0.3;
    const cornerGeometry = new THREE.SphereGeometry(cornerRadius, 16, 16);
    const cornerPositions = [
      { x: 5 - cornerRadius, y: 0.15, z: 3.25 - cornerRadius },
      { x: 5 - cornerRadius, y: 0.15, z: -3.25 + cornerRadius },
      { x: -5 + cornerRadius, y: 0.15, z: 3.25 - cornerRadius },
      { x: -5 + cornerRadius, y: 0.15, z: -3.25 + cornerRadius }
    ];
    
    cornerPositions.forEach(pos => {
      const corner = new THREE.Mesh(cornerGeometry, silverMaterial);
      corner.position.set(pos.x, pos.y, pos.z);
      base.add(corner);
    });

    // Create keyboard area with more detail
    const keyboardIndentGeometry = new THREE.BoxGeometry(9.5, 0.05, 6);
    const keyboardIndent = new THREE.Mesh(keyboardIndentGeometry, darkSilverMaterial);
    keyboardIndent.position.set(0, 0.15, 0);
    base.add(keyboardIndent);

    // Create MacBook-style keyboard keys
    const keyGeometry = new THREE.BoxGeometry(0.3, 0.05, 0.3);
    
    // Function key row
    for (let i = 0; i < 14; i++) {
      const key = new THREE.Mesh(keyGeometry, keyMaterial);
      key.position.set(
        (i - 6.5) * 0.65,
        0.18,
        -2.5
      );
      base.add(key);
    }
    
    // Number row
    for (let i = 0; i < 14; i++) {
      const key = new THREE.Mesh(keyGeometry, keyMaterial);
      key.position.set(
        (i - 6.5) * 0.65,
        0.18,
        -1.8
      );
      base.add(key);
    }
    
    // QWERTY rows
    for (let row = 0; row < 3; row++) {
      const keyCount = row === 0 ? 13 : row === 1 ? 12 : 11;
      const offset = row === 0 ? 0 : row === 1 ? 0.3 : 0.6;
      
      for (let i = 0; i < keyCount; i++) {
        const key = new THREE.Mesh(keyGeometry, keyMaterial);
        key.position.set(
          (i - (keyCount - 1) / 2) * 0.65 + offset,
          0.18,
          -1.1 + row * 0.65
        );
        base.add(key);
      }
    }
    
    // Space bar
    const spaceBarGeometry = new THREE.BoxGeometry(3.5, 0.05, 0.3);
    const spaceBar = new THREE.Mesh(spaceBarGeometry, keyMaterial);
    spaceBar.position.set(0, 0.18, 1.8);
    base.add(spaceBar);

    // Create MacBook-style trackpad
    const trackpadGeometry = new THREE.BoxGeometry(3.5, 0.02, 2.2);
    const trackpad = new THREE.Mesh(trackpadGeometry, darkSilverMaterial);
    trackpad.position.set(0, 0.18, 2.5);
    base.add(trackpad);

    // Add speaker grilles (MacBook style)
    const speakerGrilleGeometry = new THREE.BoxGeometry(8, 0.05, 0.1);
    const speakerGrilleLeft = new THREE.Mesh(speakerGrilleGeometry, speakerMaterial);
    speakerGrilleLeft.position.set(0, 0.15, -3.2);
    base.add(speakerGrilleLeft);
    
    const speakerGrilleRight = new THREE.Mesh(speakerGrilleGeometry, speakerMaterial);
    speakerGrilleRight.position.set(0, 0.15, 3.2);
    base.add(speakerGrilleRight);

    // Add side ports
    const portGeometry = new THREE.BoxGeometry(0.3, 0.2, 0.1);
    
    // Left side ports
    for (let i = 0; i < 3; i++) {
      const port = new THREE.Mesh(portGeometry, darkSilverMaterial);
      port.position.set(-5, 0.15, -1 + i * 0.5);
      base.add(port);
    }
    
    // Right side ports
    for (let i = 0; i < 2; i++) {
      const port = new THREE.Mesh(portGeometry, darkSilverMaterial);
      port.position.set(5, 0.15, -0.5 + i * 0.5);
      base.add(port);
    }

    // Create MacBook-style screen
    const screenGroup = new THREE.Group();
    screenGroup.position.set(0, 4.5, -3);
    screenGroup.rotation.x = -0.3;
    laptop.add(screenGroup);

    // Screen bezel with rounded corners (thinner like MacBook)
    const screenBezelGeometry = new THREE.BoxGeometry(9.5, 6, 0.2);
    const screenBezel = new THREE.Mesh(screenBezelGeometry, silverMaterial);
    screenBezel.castShadow = true;
    screenBezel.receiveShadow = true;
    screenGroup.add(screenBezel);

    // Add rounded corners to the screen bezel
    const screenCornerRadius = 0.4;
    const screenCornerGeometry = new THREE.SphereGeometry(screenCornerRadius, 16, 16);
    const screenCornerPositions = [
      { x: 4.75 - screenCornerRadius, y: 3 - screenCornerRadius, z: 0.1 },
      { x: 4.75 - screenCornerRadius, y: -3 + screenCornerRadius, z: 0.1 },
      { x: -4.75 + screenCornerRadius, y: 3 - screenCornerRadius, z: 0.1 },
      { x: -4.75 + screenCornerRadius, y: -3 + screenCornerRadius, z: 0.1 }
    ];
    
    screenCornerPositions.forEach(pos => {
      const corner = new THREE.Mesh(screenCornerGeometry, silverMaterial);
      corner.position.set(pos.x, pos.y, pos.z);
      screenBezel.add(corner);
    });

    // Screen
    const screenGeometry = new THREE.BoxGeometry(9, 5.5, 0.05);
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.z = 0.1;
    screenGroup.add(screen);

    // Add a more impressive screen content with animated elements
    const screenContentGeometry = new THREE.PlaneGeometry(8.8, 5.3);
    const textureLoader = new THREE.TextureLoader();
    
    // Create a canvas for the screen content
    const canvas = document.createElement('canvas');
    canvas.width = 1920;
    canvas.height = 1080;
    const context = canvas.getContext('2d');
    
    if (context) {
      // Create a gradient background
      const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#0f172a'); // Dark blue
      gradient.addColorStop(0.5, '#1e293b');
      gradient.addColorStop(1, '#0f172a');
      context.fillStyle = gradient;
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add a grid pattern
      context.strokeStyle = 'rgba(14, 165, 233, 0.1)';
      context.lineWidth = 1;
      const gridSize = 50;
      
      for (let x = 0; x < canvas.width; x += gridSize) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, canvas.height);
        context.stroke();
      }
      
      for (let y = 0; y < canvas.height; y += gridSize) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(canvas.width, y);
        context.stroke();
      }
      
      // Add a terminal-like window
      const terminalX = 100;
      const terminalY = 100;
      const terminalWidth = 800;
      const terminalHeight = 600;
      
      // Terminal background
      context.fillStyle = 'rgba(15, 23, 42, 0.8)';
      context.fillRect(terminalX, terminalY, terminalWidth, terminalHeight);
      
      // Terminal border
      context.strokeStyle = '#0ea5e9';
      context.lineWidth = 2;
      context.strokeRect(terminalX, terminalY, terminalWidth, terminalHeight);
      
      // Terminal header
      context.fillStyle = '#0ea5e9';
      context.fillRect(terminalX, terminalY, terminalWidth, 40);
      
      // Terminal buttons
      context.fillStyle = '#ef4444';
      context.beginPath();
      context.arc(terminalX + 20, terminalY + 20, 8, 0, Math.PI * 2);
      context.fill();
      
      context.fillStyle = '#eab308';
      context.beginPath();
      context.arc(terminalX + 45, terminalY + 20, 8, 0, Math.PI * 2);
      context.fill();
      
      context.fillStyle = '#22c55e';
      context.beginPath();
      context.arc(terminalX + 70, terminalY + 20, 8, 0, Math.PI * 2);
      context.fill();
      
      // Terminal content
      context.fillStyle = '#60a5fa';
      context.font = '24px monospace';
      const codeLines = [
        '> const developer = {',
        '>   name: "yb#2702",',
        '>   skills: ["Web Dev", "AI"],',
        '>   passion: "Building Future"',
        '> };',
        '',
        '> developer.skills.forEach(skill => {',
        '>   console.log(`Mastering ${skill}...`);',
        '> });',
        '',
        '> // Output:',
        '> // Mastering Web Dev...',
        '> // Mastering AI...'
      ];
      
      codeLines.forEach((line, i) => {
        context.fillText(line, terminalX + 30, terminalY + 80 + i * 35);
      });
      
      // Add a floating window with portfolio preview
      const windowX = 1000;
      const windowY = 200;
      const windowWidth = 700;
      const windowHeight = 500;
      
      // Window background
      context.fillStyle = 'rgba(30, 41, 59, 0.9)';
      context.fillRect(windowX, windowY, windowWidth, windowHeight);
      
      // Window border
      context.strokeStyle = '#0ea5e9';
      context.lineWidth = 2;
      context.strokeRect(windowX, windowY, windowWidth, windowHeight);
      
      // Window header
      context.fillStyle = '#0ea5e9';
      context.fillRect(windowX, windowY, windowWidth, 40);
      
      // Window title
      context.fillStyle = '#ffffff';
      context.font = '18px sans-serif';
      context.fillText('Portfolio Preview', windowX + 15, windowY + 25);
      
      // Simulated website preview
      context.fillStyle = '#64748b';
      context.fillRect(windowX + 20, windowY + 60, windowWidth - 40, 30);
      
      context.fillStyle = '#94a3b8';
      context.fillRect(windowX + 20, windowY + 100, (windowWidth - 40) / 3 - 10, 150);
      context.fillRect(windowX + 20 + (windowWidth - 40) / 3 + 10, windowY + 100, (windowWidth - 40) / 3 - 10, 150);
      context.fillRect(windowX + 20 + 2 * ((windowWidth - 40) / 3 + 10), windowY + 100, (windowWidth - 40) / 3 - 10, 150);
      
      // Add some text blocks
      for (let i = 0; i < 5; i++) {
        context.fillStyle = '#cbd5e1';
        context.fillRect(windowX + 20, windowY + 270 + i * 40, windowWidth - 40 - Math.random() * 200, 20);
      }
      
      // Add a floating terminal cursor
      const cursorX = terminalX + 30 + context.measureText('> developer.skills.forEach(skill => {').width;
      const cursorY = terminalY + 80 + 7 * 35;
      
      if (Math.floor(Date.now() / 500) % 2 === 0) {
        context.fillStyle = '#60a5fa';
        context.fillRect(cursorX, cursorY - 20, 2, 24);
      }
    }
    
    const screenTexture = new THREE.CanvasTexture(canvas);
    const screenContentMaterial = new THREE.MeshBasicMaterial({
      map: screenTexture,
      emissive: 0x0ea5e9, // Brighter blue emissive
      emissiveIntensity: 0.5 // Increased intensity
    });
    
    const screenContent = new THREE.Mesh(screenContentGeometry, screenContentMaterial);
    screenContent.position.z = 0.11;
    screenGroup.add(screenContent);

    // Add Apple logo to the back of the screen
    const logoGeometry = new THREE.BoxGeometry(1.5, 0.8, 0.05);
    const logoMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xcccccc, // Silver logo
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0xcccccc,
      emissiveIntensity: 0.2
    });
    const logo = new THREE.Mesh(logoGeometry, logoMaterial);
    logo.position.set(0, 0, -0.1);
    screenBezel.add(logo);

    // Add webcam
    const webcamGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.05, 16);
    const webcamMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x888888, // Dark silver webcam
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0x888888,
      emissiveIntensity: 0.1
    });
    const webcam = new THREE.Mesh(webcamGeometry, webcamMaterial);
    webcam.position.set(0, 2.8, 0.1);
    webcam.rotation.x = Math.PI / 2;
    screenBezel.add(webcam);

    // Enhanced lighting setup for better visibility in dark mode
    // Ambient light for overall illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Main directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);
    
    // Secondary directional light for fill
    const directionalLight2 = new THREE.DirectionalLight(0x93c5fd, 0.7);
    directionalLight2.position.set(-5, 3, -5);
    scene.add(directionalLight2);
    
    // Point light for highlights
    const pointLight = new THREE.PointLight(0xffffff, 0.7);
    pointLight.position.set(0, 5, 0);
    scene.add(pointLight);
    
    // Rim light for edge definition
    const rimLight = new THREE.DirectionalLight(0x93c5fd, 0.7);
    rimLight.position.set(0, -5, -5);
    scene.add(rimLight);

    // Add a spotlight on the laptop
    const spotLight = new THREE.SpotLight(0xffffff, 1.0);
    spotLight.position.set(0, 10, 0);
    spotLight.angle = Math.PI / 6;
    spotLight.penumbra = 0.2;
    spotLight.decay = 2;
    spotLight.distance = 20;
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.target = laptop;
    scene.add(spotLight);

    // Add screen glow light
    const screenLight = new THREE.PointLight(0x0ea5e9, 0.8, 10);
    screenLight.position.set(0, 4.5, -3);
    scene.add(screenLight);

    // Position camera
    camera.position.set(0, 3, 12);
    camera.lookAt(0, 1, 0);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      if (laptopRef.current) {
        // Apply rotation velocity
        if (!isDragging) {
          laptopRef.current.rotation.y += rotationVelocity.current.y;
          laptopRef.current.rotation.x += rotationVelocity.current.x;
          
          // Dampen the rotation velocity
          rotationVelocity.current.x *= 0.98;
          rotationVelocity.current.y *= 0.98;
          
          // If rotation is very slow, resume default spinning
          if (Math.abs(rotationVelocity.current.y) < 0.001) {
            rotationVelocity.current.y = 0.005;
          }
        }
      }
      
      // Slowly rotate stars for parallax effect
      if (starsRef.current) {
        starsRef.current.rotation.y += 0.0001;
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

  // Mouse events for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setPreviousMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !laptopRef.current) return;
    
    const deltaX = e.clientX - previousMousePosition.x;
    const deltaY = e.clientY - previousMousePosition.y;
    
    // Update rotation based on mouse movement
    laptopRef.current.rotation.y += deltaX * 0.01;
    laptopRef.current.rotation.x += deltaY * 0.01;
    
    // Update rotation velocity for smooth deceleration
    rotationVelocity.current.y = deltaX * 0.001;
    rotationVelocity.current.x = deltaY * 0.001;
    
    setPreviousMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch events for mobile
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
    
    // Update rotation based on touch movement
    laptopRef.current.rotation.y += deltaX * 0.01;
    laptopRef.current.rotation.x += deltaY * 0.01;
    
    // Update rotation velocity for smooth deceleration
    rotationVelocity.current.y = deltaX * 0.001;
    rotationVelocity.current.x = deltaY * 0.001;
    
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
    />
  );
};