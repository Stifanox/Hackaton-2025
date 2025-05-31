import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Komponent Reacta (TypeScript) renderujący cztery panele fotowoltaiczne w rzędzie za pomocą Three.js.
 *
 * Jak użyć:
 * 1. Upewnij się, że masz zainstalowany pakiet Three.js:
 *    npm install three
 *
 * 2. Skopiuj ten plik jako SolarPanelsScene.tsx w swoim projekcie React.
 *
 * 3. W pliku, w którym chcesz osadzić scenę, zaimportuj i użyj komponent:
 *    import SolarPanelsScene from './ścieżka/do/SolarPanelsScene';
 *
 *    function App() {
 *      return (
 *        <div style={{ width: '100vw', height: '100vh' }}>
 *          <SolarPanelsScene />
 *        </div>
 *      );
 *    }
 *
 * 4. Upewnij się, że kontener, w którym jest komponent, ma określone wymiary (np. 100vw/100vh),
 *    żeby renderer mógł zająć cały obszar.
 */

const SolarPanelsScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  let renderer: THREE.WebGLRenderer;
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let controls: OrbitControls;
  let animationId: number;

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. INITIALIZACJA RENDERERA
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);

    // 2. SCENA
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    // 3. KAMERA
    const aspect =
      containerRef.current.clientWidth / containerRef.current.clientHeight;
    camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    camera.position.set(0, 2, 5);

    // 4. ORBIT CONTROLS
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2;
    controls.maxDistance = 20;

    // 5. OŚWIETLENIE
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.left = -5;
    directionalLight.shadow.camera.right = 5;
    directionalLight.shadow.camera.top = 5;
    directionalLight.shadow.camera.bottom = -5;
    scene.add(directionalLight);

    // 6. PODŁOGA
    const floorGeometry = new THREE.PlaneGeometry(10, 10);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // 7. MATERIAŁY PANELOW
    const panelMaterial = new THREE.MeshStandardMaterial({
      color: 0x223355,
      metalness: 0.3,
      roughness: 0.6,
    });

    const frameMaterial = new THREE.MeshStandardMaterial({
      color: 0x111111,
      metalness: 0.5,
      roughness: 0.3,
    });

    // 8. FUNKCJA TWORZĄCA POJEDYNCZY PANEL
    const panelWidth = 1.6;
    const panelHeight = 1.0;
    const panelDepth = 0.02;
    const frameThickness = 0.05;
    const frameDepth = 0.03;

    const createPanel = (): THREE.Group => {
      const group = new THREE.Group();

      // 8.1: Powierzchnia PV (Plane)
      const pvGeometry = new THREE.PlaneGeometry(panelWidth, panelHeight);
      const pvMesh = new THREE.Mesh(pvGeometry, panelMaterial);
      pvMesh.rotation.x = -Math.PI / 2;
      pvMesh.receiveShadow = true;
      pvMesh.castShadow = true;
      group.add(pvMesh);

      // 8.2: Ramka z czterech boxów
      const createFrameEdge = (
        width: number,
        height: number,
        depth: number,
        posX: number,
        posY: number,
        posZ: number
      ): THREE.Mesh => {
        const geo = new THREE.BoxGeometry(width, height, depth);
        const mesh = new THREE.Mesh(geo, frameMaterial);
        mesh.position.set(posX, posY, posZ);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
      };

      // Lewa krawędź
      const edgeLeft = createFrameEdge(
        frameThickness,
        panelHeight + frameThickness,
        frameDepth,
        -(panelWidth / 2 + frameThickness / 2),
        panelDepth / 2,
        0
      );
      const edgeRight = createFrameEdge(
        frameThickness,
        panelHeight + frameThickness,
        frameDepth,
        panelWidth / 2 + frameThickness / 2,
        panelDepth / 2,
        0
      );

      // Górna krawędź
      const edgeTop = createFrameEdge(
        panelWidth + frameThickness,
        frameThickness,
        frameDepth,
        0,
        panelDepth / 2 + panelHeight / 2 + frameThickness / 2,
        0
      );

      // Dolna krawędź
      const edgeBottom = createFrameEdge(
        panelWidth + frameThickness,
        frameThickness,
        frameDepth,
        0,
        panelDepth / 2 - panelHeight / 2 - frameThickness / 2,
        0
      );

      group.add(edgeLeft, edgeRight, edgeTop, edgeBottom);
      return group;
    };

    // 9. DODANIE 4 PANELI W RZĘDZIE
    const panelsGroup = new THREE.Group();
    for (let i = 0; i < 4; i++) {
      const panel = createPanel();
      const xPos =
        i * (panelWidth + spacing) - ((4 - 1) * (panelWidth + spacing)) / 2;
      panel.position.set(xPos, panelHeight / 2 + 0.01, 0);
      panelsGroup.add(panel);
    }
    scene.add(panelsGroup);

    // 10. ANIMACJA
    const animate = (): void => {
      controls.update();
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };
    animate();

    // 11. OBSŁUGA ZMIANY ROZMIARU OKNA
    const handleResize = (): void => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
    };
    window.addEventListener("resize", handleResize);

    // 12. CLEANUP PRZY ODPINANIU KOMPONENTU
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      controls.dispose();
      renderer.dispose();
      scene.clear();
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
};

export default SolarPanelsScene;

// Uwaga: Konieczne jest zadeklarowanie spacing przed użyciem w pętli:
const spacing = 0.2; // odległość między panelami (0.2 m)
