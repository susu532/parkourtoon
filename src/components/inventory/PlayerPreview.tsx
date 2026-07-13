import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { generateSkin, applySkinUVs } from '../../game/SkinManager';
import { settingsManager } from '../../game/Settings';

export const PlayerPreview = ({ scale = 6, seed }: { scale?: number; seed?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [skinSeed, setSkinSeed] = useState('');

  useEffect(() => {
    const username = settingsManager.getSettings().username || 'player';
    const actualSeed = seed || localStorage.getItem('skyBridge_skin_seed') || username;
    setSkinSeed(actualSeed);
  }, [seed]);

  useEffect(() => {
    if (!skinSeed) return;

    const container = containerRef.current;
    if (!container) return;

    // Create scene, camera, and renderer with antialiasing and transparent background
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    // Configure renderer
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth || 128, container.clientHeight || 192);
    renderer.shadowMap.enabled = false;
    container.appendChild(renderer.domElement);

    // Camera setup - looking slightly downward at chest level
    const cameraTarget = new THREE.Vector3(0, 0.95, 0);
    camera.position.set(0, 1.15, 2.3);
    camera.lookAt(cameraTarget);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight1.position.set(3, 4, 3);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.25);
    dirLight2.position.set(-3, 1, -3);
    scene.add(dirLight2);

    // Skin texture & materials
    const skinTexture = generateSkin(skinSeed);
    
    // NearestFilter keeps the beautiful crispy retro pixels intact!
    skinTexture.magFilter = THREE.NearestFilter;
    skinTexture.minFilter = THREE.NearestFilter;

    const skinMaterial = new THREE.MeshStandardMaterial({
      map: skinTexture,
      transparent: true,
      alphaTest: 0.1,
      side: THREE.DoubleSide,
      roughness: 0.85,
      metalness: 0.02,
    });

    const outerMaterial = new THREE.MeshStandardMaterial({
      map: skinTexture,
      transparent: true,
      alphaTest: 0.1,
      side: THREE.DoubleSide,
      roughness: 0.85,
      metalness: 0.02,
    });

    // character group container (for orbiting with spine centered)
    const characterGroup = new THREE.Group();
    scene.add(characterGroup);

    // --- Geometries & Meshes mirroring PlayerRenderer.ts specifications ---
    
    // Body Mesh
    const bodyGeo = new THREE.BoxGeometry(0.4, 0.6, 0.2);
    applySkinUVs(bodyGeo, "body");
    const bodyMesh = new THREE.Mesh(bodyGeo, skinMaterial);
    bodyMesh.position.y = 0.9;
    characterGroup.add(bodyMesh);

    // Body Outer Jacket/Coat
    const bodyOuterGeo = new THREE.BoxGeometry(0.42, 0.62, 0.22);
    applySkinUVs(bodyOuterGeo, "body", true);
    const bodyOuter = new THREE.Mesh(bodyOuterGeo, outerMaterial);
    bodyMesh.add(bodyOuter);

    // Head Mesh
    const headGeo = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    applySkinUVs(headGeo, "head");
    const headMesh = new THREE.Mesh(headGeo, skinMaterial);
    headMesh.position.y = 0.5; // Offset from body mesh center (0.9 + 0.5 = 1.4 head center)
    bodyMesh.add(headMesh);

    // Head Outer Hat Layer
    const headOuterGeo = new THREE.BoxGeometry(0.42, 0.42, 0.42);
    applySkinUVs(headOuterGeo, "head", true);
    const headOuter = new THREE.Mesh(headOuterGeo, outerMaterial);
    headMesh.add(headOuter);

    // Left Arm Mesh
    const armGeoL = new THREE.BoxGeometry(0.2, 0.6, 0.2);
    applySkinUVs(armGeoL, "armL");
    const leftArmMesh = new THREE.Mesh(armGeoL, skinMaterial);
    leftArmMesh.position.set(-0.31, 0.3, 0); // pivot offset
    leftArmMesh.geometry = armGeoL.clone();
    leftArmMesh.geometry.translate(0, -0.3, 0); // shift pivot to shoulder
    bodyMesh.add(leftArmMesh);

    // Left Arm Outer
    const armOuterGeoL = new THREE.BoxGeometry(0.22, 0.62, 0.22);
    applySkinUVs(armOuterGeoL, "armL", true);
    const armOuterL = new THREE.Mesh(armOuterGeoL, outerMaterial);
    armOuterL.position.y = -0.3;
    leftArmMesh.add(armOuterL);

    // Right Arm Mesh
    const armGeoR = new THREE.BoxGeometry(0.2, 0.6, 0.2);
    applySkinUVs(armGeoR, "armR");
    const rightArmMesh = new THREE.Mesh(armGeoR, skinMaterial);
    rightArmMesh.position.set(0.31, 0.3, 0);
    rightArmMesh.geometry = armGeoR.clone();
    rightArmMesh.geometry.translate(0, -0.3, 0); // shift pivot to shoulder
    bodyMesh.add(rightArmMesh);

    // Right Arm Outer
    const armOuterGeoR = new THREE.BoxGeometry(0.22, 0.62, 0.22);
    applySkinUVs(armOuterGeoR, "armR", true);
    const armOuterR = new THREE.Mesh(armOuterGeoR, outerMaterial);
    armOuterR.position.y = -0.3;
    rightArmMesh.add(armOuterR);

    // Left Leg Mesh
    const legGeoL = new THREE.BoxGeometry(0.2, 0.6, 0.2);
    applySkinUVs(legGeoL, "legL");
    const leftLegMesh = new THREE.Mesh(legGeoL, skinMaterial);
    leftLegMesh.position.set(-0.105, 0.6, 0);
    leftLegMesh.geometry = legGeoL.clone();
    leftLegMesh.geometry.translate(0, -0.3, 0); // shift pivot to hip joint
    characterGroup.add(leftLegMesh);

    // Left Leg Outer
    const legOuterGeoL = new THREE.BoxGeometry(0.22, 0.62, 0.22);
    applySkinUVs(legOuterGeoL, "legL", true);
    const legOuterL = new THREE.Mesh(legOuterGeoL, outerMaterial);
    legOuterL.position.y = -0.3;
    leftLegMesh.add(legOuterL);

    // Right Leg Mesh
    const legGeoR = new THREE.BoxGeometry(0.2, 0.6, 0.2);
    applySkinUVs(legGeoR, "legR");
    const rightLegMesh = new THREE.Mesh(legGeoR, skinMaterial);
    rightLegMesh.position.set(0.105, 0.6, 0);
    rightLegMesh.geometry = legGeoR.clone();
    rightLegMesh.geometry.translate(0, -0.3, 0); // shift pivot to hip joint
    characterGroup.add(rightLegMesh);

    // Right Leg Outer
    const legOuterGeoR = new THREE.BoxGeometry(0.22, 0.62, 0.22);
    applySkinUVs(legOuterGeoR, "legR", true);
    const legOuterR = new THREE.Mesh(legOuterGeoR, outerMaterial);
    legOuterR.position.y = -0.3;
    rightLegMesh.add(legOuterR);

    // Drag-To-Rotate interactive states
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotationTargetY = -0.4 + Math.PI; // Opposite direction angle initially (added Math.PI)
    let rotationTargetX = 0.05;
    let lastActiveTime = Date.now();

    // Mouse tracker for head focus look-at logic
    const mousePos = { x: 0, y: 0 };
    const handleMouseMoveGlobal = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const maxDistance = 350;
      mousePos.x = Math.max(-1, Math.min(1, dx / maxDistance));
      mousePos.y = Math.max(-1, Math.min(1, dy / maxDistance));
    };

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
      lastActiveTime = Date.now();
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaMove = {
        x: e.clientX - previousMousePosition.x,
        y: e.clientY - previousMousePosition.y,
      };

      rotationTargetY += deltaMove.x * 0.015;
      rotationTargetX += deltaMove.y * 0.012;
      
      // Keep vertical constraints to protect visual boundaries
      rotationTargetX = Math.max(-0.4, Math.min(0.5, rotationTargetX));

      previousMousePosition = { x: e.clientX, y: e.clientY };
      lastActiveTime = Date.now();
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('mousemove', handleMouseMoveGlobal);

    // Setup perfect ResizeObserver monitoring
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width && height) {
          renderer.setSize(width, height);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
        }
      }
    });
    resizeObserver.observe(container);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const time = clock.getElapsedTime();
      
      // Natural auto-rotation if idle in opposite direction
      if (!isDragging && Date.now() - lastActiveTime > 3000) {
        rotationTargetY += 0.005;
      }

      // Snappy linear interpolation (lerp) for responsive rotation feels
      characterGroup.rotation.y += (rotationTargetY - characterGroup.rotation.y) * 0.12;
      characterGroup.rotation.x += (rotationTargetX - characterGroup.rotation.x) * 0.12;

      // Beautiful animated breathing loop & minor body sway
      const breath = Math.sin(time * 1.8) * 0.015;
      bodyMesh.position.y = 0.9 + breath;

      // Smart world-to-local head rotation to follow mouse cursor
      // Since local head rotation is relative to body rotation, we calculate the angular difference.
      const targetWorldY = mousePos.x * 0.65;
      const bodyFrontY = characterGroup.rotation.y - Math.PI; // body front is opposite of rotation Y
      const relativeY = targetWorldY - bodyFrontY;
      
      // Minimize relative angle to [-PI, PI] range to prevent wrap-around snapping
      const normalizedRelativeY = Math.atan2(Math.sin(relativeY), Math.cos(relativeY));
      
      // Clamp head's local Y rotation to natural human bounds (~75 degrees)
      const clampedHeadY = Math.max(-1.3, Math.min(1.3, normalizedRelativeY));

      const clampedHeadX = Math.max(-0.6, Math.min(0.6, mousePos.y * 0.45));

      headMesh.rotation.y += (clampedHeadY - headMesh.rotation.y) * 0.12;
      headMesh.rotation.x += (clampedHeadX - headMesh.rotation.x) * 0.12;
      
      // Arms reverse slow sway
      leftArmMesh.rotation.z = -Math.abs(Math.sin(time * 1.4)) * 0.03 - 0.04;
      leftArmMesh.rotation.x = Math.sin(time * 1.4) * 0.05;

      rightArmMesh.rotation.z = Math.abs(Math.sin(time * 1.4)) * 0.03 + 0.04;
      rightArmMesh.rotation.x = -Math.sin(time * 1.4) * 0.05;

      // Legs minor breathing sway
      leftLegMesh.rotation.x = Math.sin(time * 1.4) * 0.03;
      rightLegMesh.rotation.x = -Math.sin(time * 1.4) * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    // CLEANUP STAGE
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      
      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('mousemove', handleMouseMoveGlobal);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      // Dipose files to guarantee zero memory leaks
      scene.clear();
      renderer.dispose();
      skinMaterial.dispose();
      outerMaterial.dispose();
      bodyGeo.dispose();
      bodyOuterGeo.dispose();
      headGeo.dispose();
      headOuterGeo.dispose();
      armGeoL.dispose();
      armOuterGeoL.dispose();
      armGeoR.dispose();
      armOuterGeoR.dispose();
      legGeoL.dispose();
      legOuterGeoL.dispose();
      legGeoR.dispose();
      legOuterGeoR.dispose();
    };
  }, [skinSeed]);

  return (
    <div 
      ref={containerRef}
      className="relative w-24 sm:w-32 h-32 sm:h-48 overflow-hidden bg-black/25 rounded border-2 border-[#1a1a1a]/40 shadow-inner select-none cursor-grab active:cursor-grabbing flex items-center justify-center group"
    >
      {!skinSeed && (
        <div className="text-stone-300 text-xs font-bold animate-pulse">
          Generating...
        </div>
      )}
      
      {/* Dynamic Overlay Guidance */}
      <div className="absolute bottom-1 right-1 bg-black/50 text-[7px] font-black uppercase text-white/50 px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none tracking-widest">
        Drag to Orbit
      </div>
    </div>
  );
};
