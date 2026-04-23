import React, { useEffect, useRef } from "react";
import * as THREE from "three";
// @ts-ignore
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// @ts-ignore
import { SVGLoader, SVGResult, ShapePath } from "three/examples/jsm/loaders/SVGLoader";

interface Props {
  svgUrl: string;
}

const FloorPlan3D: React.FC<Props> = ({ svgUrl }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // ── 1. RENDERER SETUP (STAINLESS VIZ QUALITY) ──
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      logarithmicDepthBuffer: true // FIXES THE FLICKERING/STRIPES IN YOUR SCREENSHOT
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Luxury Lighting Tone Mapping
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    // ── 2. CAMERA & CONTROLS ──
    const camera = new THREE.PerspectiveCamera(35, container.clientWidth / container.clientHeight, 1, 10000);
    camera.position.set(600, 700, 600);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2.1; // Stops camera from going under the floor

    // ── 3. STUDIO LIGHTING ──
    scene.add(new THREE.AmbientLight(0xffffff, 0.7)); 

    const sun = new THREE.DirectionalLight(0xffffff, 1.2);
    sun.position.set(400, 800, 200);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048); // Sharp shadows
    sun.shadow.normalBias = 0.05;
    scene.add(sun);

    // Subtle blue fill light for architectural depth
    const fillLight = new THREE.PointLight(0xCCE7FF, 0.6);
    fillLight.position.set(-400, 300, -200);
    scene.add(fillLight);

    const loader = new SVGLoader();
    
    loader.load(svgUrl, (data: SVGResult) => {
      const houseGroup = new THREE.Group();

      data.paths.forEach((path: ShapePath, index: number) => {
        const fill = path.userData?.style.fill;
        const stroke = path.userData?.style.stroke;
        
        // Skip purely white backgrounds to keep the model clean
        if (fill === "#ffffff" || fill === "white") return;

        const shapes = SVGLoader.createShapes(path);

        shapes.forEach((shape: THREE.Shape) => {
          let height = 4; 
          let color = fill || stroke || "#eeeeee";
          let isWall = false;

          const cleanColor = String(color).toLowerCase().replace(/\s+/g, "");

          // ── ARCHITECTURAL LOGIC ──
          // If it looks like a wall (Dark grey or black)
          if (cleanColor.includes("80,80,80") || cleanColor === "#505050" || cleanColor === "#000000") {
            height = 70;
            color = "#ffffff"; // Make walls white for luxury look
            isWall = true;
          } else if (cleanColor.includes("208,232,242") || cleanColor === "#d0e8f2") {
            height = 8;
            color = "#a2d2ff"; // Glass/Windows
          }

          // Create High-End Beveled Geometry
          const geometry = new THREE.ExtrudeGeometry(shape, {
            depth: height,
            bevelEnabled: true,
            bevelThickness: 0.5,
            bevelSize: 0.5,
            bevelSegments: 3
          });

          // Physical Material (Reacts beautifully to light)
          const material = new THREE.MeshPhysicalMaterial({ 
            color: color, 
            roughness: isWall ? 0.7 : 0.2,
            metalness: isWall ? 0.1 : 0.0,
            clearcoat: isWall ? 0 : 0.4
          });

          const mesh = new THREE.Mesh(geometry, material);
          
          // Coordinate correction
          mesh.rotation.x = Math.PI / 2;
          mesh.scale.y = -1;
          
          // Tiny vertical offset to stop overlapping shapes from flickering
          mesh.position.y = index * 0.01;
          
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          houseGroup.add(mesh);

          if (isWall) {
            const edges = new THREE.EdgesGeometry(geometry);
            const line = new THREE.LineSegments(
              edges, 
              new THREE.LineBasicMaterial({ color: 0x000000, opacity: 0.1, transparent: true })
            );
            mesh.add(line);
          }
        });
      });

      // ── 4. CENTERING & STAGING ──
      const box = new THREE.Box3().setFromObject(houseGroup);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      houseGroup.position.set(-center.x, 0, -center.z);

      const wrapper = new THREE.Group();
      wrapper.add(houseGroup);

      // Add a circular "Podium" base instead of a black box
      const podium = new THREE.Mesh(
        new THREE.CylinderGeometry(size.x * 0.8, size.x * 0.85, 10, 64),
        new THREE.MeshPhysicalMaterial({ color: 0x111111, roughness: 0.3 })
      );
      podium.position.y = -6;
      podium.receiveShadow = true;
      wrapper.add(podium);

      // Auto-scale model to fit view
      const scale = 500 / Math.max(size.x, size.z);
      wrapper.scale.set(scale, scale, scale);

      scene.add(wrapper);

      controls.target.set(0, 0, 0);
      controls.update();
    });

    // ── 5. ANIMATION & RESIZING ──
    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
      if (container) container.innerHTML = "";
    };
  }, [svgUrl]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#0a0a0a]" style={{ minHeight: "600px" }}>
        <div ref={containerRef} className="w-full h-full" />
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 text-white/50 text-[10px] uppercase tracking-[0.2em] pointer-events-none">
          Drag to rotate • Scroll to zoom • Right-click to pan
        </div>
    </div>
  );
};

export default FloorPlan3D;