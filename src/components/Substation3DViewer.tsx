import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Box, 
  RotateCcw, 
  Eye, 
  Activity, 
  Zap, 
  Maximize2, 
  Minimize2, 
  Info,
  Sliders,
  Layers,
  Sparkles
} from 'lucide-react';
import { soundFx } from '../utils/soundEffects';

interface PartMetadata {
  id: string;
  name: string;
  tag: string;
  norm: string;
  desc: string;
}

const PARTS_INFO: Record<string, PartMetadata> = {
  tank: {
    id: 'tank',
    name: 'Tanque Principal Estanque',
    tag: 'TK-01',
    norm: 'NBR 5356-1',
    desc: 'Construído em chapa de aço estrutural soldada, dimensionado para suportar vácuo total e sobrepressões de curto-circuito com óleo mineral isolante naftênico.'
  },
  bushingsHV: {
    id: 'bushingsHV',
    name: 'Buchas Condensivas de Alta Tensão',
    tag: 'BCH-500',
    norm: 'IEC 60137 / NBR 5034',
    desc: 'Corpo isolador cerâmico em porcelana esmaltada de alta rigidez dielétrica com centelhadores e terminal em liga de cobre para conexões até 500 kV.'
  },
  bushingsMV: {
    id: 'bushingsMV',
    name: 'Buchas de Média Tensão (15 a 34,5 kV)',
    tag: 'BCH-34',
    norm: 'NBR 5356',
    desc: 'Terminais de saída para alimentação do barramento primário ou cabine de distribuição fabril.'
  },
  radiators: {
    id: 'radiators',
    name: 'Radiadores de Resfriamento ONAN/ONAF',
    tag: 'RAD-GRP',
    norm: 'NBR 5356-2',
    desc: 'Baterias de aletas estampadas de alta condutividade térmica com válvulas borboleta para manutenção individual sem drenagem do tanque.'
  },
  conservator: {
    id: 'conservator',
    name: 'Tanque Conservador & Buchholz',
    tag: 'CNS-02',
    norm: 'NBR 5440',
    desc: 'Compensa a dilatação térmica do óleo isolante, equipado com relé de proteção Buchholz para detecção instantânea de gases e descargas parciais.'
  },
  core: {
    id: 'core',
    name: 'Núcleo Magnético & Enrolamentos',
    tag: 'NUC-MAG',
    norm: 'NBR 5356-5',
    desc: 'Lâminas de aço-silício de grão orientado (GO) com enrolamentos em cobre eletrolítico isolados por papel termoestabilizado.'
  }
};

export const Substation3DViewer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activePart, setActivePart] = useState<string>('tank');
  const [explodedVal, setExplodedVal] = useState<number>(0);
  const [wireframeMode, setWireframeMode] = useState<boolean>(false);
  const [fluxVisible, setFluxVisible] = useState<boolean>(true);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [voltagePulse, setVoltagePulse] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // References to animate parts
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const partsGroupRef = useRef<THREE.Group | null>(null);
  const fluxParticlesRef = useRef<THREE.Points | null>(null);
  const sparkMeshRef = useRef<THREE.LineSegments | null>(null);

  // Part meshes for exploded view logic
  const bushingsHVRef = useRef<THREE.Group | null>(null);
  const bushingsMVRef = useRef<THREE.Group | null>(null);
  const radiatorsLeftRef = useRef<THREE.Group | null>(null);
  const radiatorsRightRef = useRef<THREE.Group | null>(null);
  const conservatorRef = useRef<THREE.Group | null>(null);
  const coreRef = useRef<THREE.Group | null>(null);
  const tankMeshRef = useRef<THREE.Mesh | null>(null);

  // Drag interaction state
  const isDraggingRef = useRef<boolean>(false);
  const prevMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const rotationTarget = useRef<{ x: number; y: number }>({ x: 0.35, y: -0.6 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Detect software rendering fallback
    const canvasTest = document.createElement('canvas');
    const gl = canvasTest.getContext('webgl');
    const isSoftwareGl = !gl || (gl.getExtension('WEBGL_debug_renderer_info') &&
      /swiftshader|llvmpipe|software/i.test(
        gl.getParameter(gl.getExtension('WEBGL_debug_renderer_info')!.UNMASKED_RENDERER_WEBGL) || ''
      ));

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x060c14); // Deep tech obsidian
    scene.fog = new THREE.FogExp2(0x060c14, 0.04);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(6.2, 4.2, 7.2);
    camera.lookAt(0, 0.5, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isSoftwareGl ? 1 : 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // Lighting: High-contrast cinematic studio lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffaed, 3.2); // Warm bronze/gold keylight
    keyLight.position.set(7, 10, 8);
    keyLight.castShadow = !isSoftwareGl;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 2.4); // Electric cyan fill
    fillLight.position.set(-8, 6, 5);
    scene.add(fillLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 1.8);
    backLight.position.set(0, 8, -8);
    scene.add(backLight);

    const groundGlow = new THREE.PointLight(0x00e5ff, 2.0, 12);
    groundGlow.position.set(0, -0.2, 0);
    scene.add(groundGlow);

    // Engineering Ground Grid
    const gridHelper = new THREE.GridHelper(16, 32, 0xc9a227, 0x1e3a4a);
    gridHelper.position.y = -1.5;
    scene.add(gridHelper);

    // Base concrete pad
    const padGeo = new THREE.BoxGeometry(7, 0.25, 5);
    const padMat = new THREE.MeshStandardMaterial({
      color: 0x16202c,
      roughness: 0.9,
      metalness: 0.1
    });
    const padMesh = new THREE.Mesh(padGeo, padMat);
    padMesh.position.y = -1.62;
    padMesh.receiveShadow = true;
    scene.add(padMesh);

    // Master Group for transformer
    const transformerGroup = new THREE.Group();
    partsGroupRef.current = transformerGroup;
    scene.add(transformerGroup);

    // MATERIALS
    const metalTealMat = new THREE.MeshStandardMaterial({
      color: 0x0a3d4a,
      roughness: 0.35,
      metalness: 0.75
    });

    const bronzeMat = new THREE.MeshStandardMaterial({
      color: 0xc9a227,
      roughness: 0.25,
      metalness: 0.85
    });

    const porcelainMat = new THREE.MeshStandardMaterial({
      color: 0x8a381c, // Ceramic terracotta/reddish porcelain for high-voltage bushings
      roughness: 0.15,
      metalness: 0.1
    });

    const copperMat = new THREE.MeshStandardMaterial({
      color: 0xd97736,
      roughness: 0.3,
      metalness: 0.9
    });

    // 1. MAIN TANK
    const tankGeo = new THREE.BoxGeometry(2.4, 2.2, 1.8);
    const tankMesh = new THREE.Mesh(tankGeo, metalTealMat);
    tankMesh.position.y = 0;
    tankMesh.castShadow = true;
    tankMesh.receiveShadow = true;
    tankMeshRef.current = tankMesh;
    transformerGroup.add(tankMesh);

    // Structural stiffeners / ribs on tank
    for (let i = -0.7; i <= 0.7; i += 0.45) {
      const ribGeo = new THREE.BoxGeometry(2.45, 0.08, 1.85);
      const ribMesh = new THREE.Mesh(ribGeo, bronzeMat);
      ribMesh.position.y = i;
      tankMesh.add(ribMesh);
    }

    // 2. INTERNAL CORE (shown in X-Ray / Exploded view)
    const coreGroup = new THREE.Group();
    coreRef.current = coreGroup;
    const coreYokeGeo = new THREE.BoxGeometry(1.6, 1.5, 0.9);
    const coreYokeMat = new THREE.MeshStandardMaterial({
      color: 0x223545,
      roughness: 0.8,
      metalness: 0.5,
      wireframe: false
    });
    const coreYoke = new THREE.Mesh(coreYokeGeo, coreYokeMat);
    coreGroup.add(coreYoke);

    // 3 Copper Phase Windings (U, V, W)
    [-0.5, 0, 0.5].forEach((xPos) => {
      const windingGeo = new THREE.CylinderGeometry(0.22, 0.22, 1.3, 24);
      const windingMesh = new THREE.Mesh(windingGeo, copperMat);
      windingMesh.position.x = xPos;
      coreGroup.add(windingMesh);
    });
    coreGroup.visible = false;
    transformerGroup.add(coreGroup);

    // 3. HIGH-VOLTAGE BUSHINGS (500 kV Class) - Top Right
    const hvGroup = new THREE.Group();
    bushingsHVRef.current = hvGroup;
    hvGroup.position.set(0, 1.1, 0.4);

    [-0.6, 0, 0.6].forEach((xPos, idx) => {
      const phaseGroup = new THREE.Group();
      phaseGroup.position.x = xPos;

      // Base mount turret
      const turretGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.35, 16);
      const turretMesh = new THREE.Mesh(turretGeo, bronzeMat);
      turretMesh.position.y = 0.17;
      phaseGroup.add(turretMesh);

      // Ceramic bushing skirted column
      const skirtGeo = new THREE.CylinderGeometry(0.12, 0.16, 1.5, 20);
      const skirtMesh = new THREE.Mesh(skirtGeo, porcelainMat);
      skirtMesh.position.y = 0.95;
      phaseGroup.add(skirtMesh);

      // Rings (petticoats / sheds)
      for (let r = 0.4; r <= 1.6; r += 0.22) {
        const ringGeo = new THREE.TorusGeometry(0.2, 0.04, 12, 24);
        const ringMesh = new THREE.Mesh(ringGeo, porcelainMat);
        ringMesh.rotation.x = Math.PI / 2;
        ringMesh.position.y = r;
        phaseGroup.add(ringMesh);
      }

      // Copper Terminal Head & Spark Gap
      const headGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const headMesh = new THREE.Mesh(headGeo, copperMat);
      headMesh.position.y = 1.75;
      phaseGroup.add(headMesh);

      // Phase identification label marker ring (Red, White, Blue / NBR Phase tags)
      const phaseColor = [0xef4444, 0xf8fafc, 0x3b82f6][idx];
      const tagGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.06, 16);
      const tagMat = new THREE.MeshBasicMaterial({ color: phaseColor });
      const tagMesh = new THREE.Mesh(tagGeo, tagMat);
      tagMesh.position.y = 0.38;
      phaseGroup.add(tagMesh);

      hvGroup.add(phaseGroup);
    });
    transformerGroup.add(hvGroup);

    // 4. MEDIUM-VOLTAGE BUSHINGS (15 to 34.5 kV Class) - Top Left
    const mvGroup = new THREE.Group();
    bushingsMVRef.current = mvGroup;
    mvGroup.position.set(0, 1.1, -0.4);

    [-0.55, -0.18, 0.18, 0.55].forEach((xPos, idx) => {
      const bGroup = new THREE.Group();
      bGroup.position.x = xPos;

      const mvBushingGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.75, 16);
      const mvBushingMesh = new THREE.Mesh(mvBushingGeo, porcelainMat);
      mvBushingMesh.position.y = 0.37;
      bGroup.add(mvBushingMesh);

      const terminalGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.25, 12);
      const terminalMesh = new THREE.Mesh(terminalGeo, bronzeMat);
      terminalMesh.position.y = 0.85;
      bGroup.add(terminalMesh);

      mvGroup.add(bGroup);
    });
    transformerGroup.add(mvGroup);

    // 5. RADIATOR COOLING FINS (Left and Right Flanks)
    const radLeft = new THREE.Group();
    radiatorsLeftRef.current = radLeft;
    radLeft.position.set(-1.4, 0, 0);

    const radRight = new THREE.Group();
    radiatorsRightRef.current = radRight;
    radRight.position.set(1.4, 0, 0);

    const buildRadiatorBank = (parentGroup: THREE.Group) => {
      // Top and bottom manifold oil pipes
      const pipeGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.5, 16);
      const pipeMat = new THREE.MeshStandardMaterial({ color: 0x1a4350, metalness: 0.7, roughness: 0.3 });
      
      const topPipe = new THREE.Mesh(pipeGeo, pipeMat);
      topPipe.rotation.x = Math.PI / 2;
      topPipe.position.y = 0.85;
      parentGroup.add(topPipe);

      const botPipe = new THREE.Mesh(pipeGeo, pipeMat);
      botPipe.rotation.x = Math.PI / 2;
      botPipe.position.y = -0.85;
      parentGroup.add(botPipe);

      // Cooling plates
      for (let z = -0.65; z <= 0.65; z += 0.15) {
        const plateGeo = new THREE.BoxGeometry(0.18, 1.6, 0.02);
        const plateMesh = new THREE.Mesh(plateGeo, metalTealMat);
        plateMesh.position.set(0, 0, z);
        parentGroup.add(plateMesh);
      }
    };
    buildRadiatorBank(radLeft);
    buildRadiatorBank(radRight);
    transformerGroup.add(radLeft);
    transformerGroup.add(radRight);

    // 6. CONSERVATOR TANK (Expansion Oil Tank on top)
    const conservatorGroup = new THREE.Group();
    conservatorRef.current = conservatorGroup;
    conservatorGroup.position.set(0, 2.5, 0);

    const barrelGeo = new THREE.CylinderGeometry(0.35, 0.35, 1.8, 24);
    const barrelMesh = new THREE.Mesh(barrelGeo, metalTealMat);
    barrelMesh.rotation.z = Math.PI / 2;
    conservatorGroup.add(barrelMesh);

    // Buchholz relay cylinder
    const buchholzGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.35, 16);
    const buchholzMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.8, roughness: 0.3 });
    const buchholzMesh = new THREE.Mesh(buchholzGeo, buchholzMat);
    buchholzMesh.position.set(-0.4, -0.4, 0);
    conservatorGroup.add(buchholzMesh);

    // Oil level gauge sight glass
    const gaugeGeo = new THREE.BoxGeometry(0.05, 0.25, 0.08);
    const gaugeMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const gaugeMesh = new THREE.Mesh(gaugeGeo, gaugeMat);
    gaugeMesh.position.set(0.7, 0, 0.35);
    conservatorGroup.add(gaugeMesh);

    transformerGroup.add(conservatorGroup);

    // 7. MARSHALING CONTROL KIOSK (Painel de Comando frontal)
    const kioskGeo = new THREE.BoxGeometry(0.65, 0.95, 0.22);
    const kioskMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, metalness: 0.6, roughness: 0.4 });
    const kioskMesh = new THREE.Mesh(kioskGeo, kioskMat);
    kioskMesh.position.set(0, -0.3, 1.0);
    transformerGroup.add(kioskMesh);

    // Kiosk mimic display light
    const mimicGeo = new THREE.PlaneGeometry(0.4, 0.25);
    const mimicMat = new THREE.MeshBasicMaterial({ color: 0x059669 });
    const mimicMesh = new THREE.Mesh(mimicGeo, mimicMat);
    mimicMesh.position.set(0, -0.15, 1.12);
    transformerGroup.add(mimicMesh);

    // 8. ELECTROMAGNETIC FLUX PARTICLES (Toroidal field representation)
    const particleCount = isSoftwareGl ? 300 : 750;
    const fluxGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI * 0.9;
      const radius = 2.2 + Math.random() * 1.6;

      positions[i * 3] = radius * Math.cos(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * 1.2;
      positions[i * 3 + 2] = radius * Math.cos(phi) * Math.sin(theta);

      // Cyan to Gold gradient
      const isGold = Math.random() > 0.6;
      colors[i * 3] = isGold ? 0.9 : 0.05;
      colors[i * 3 + 1] = isGold ? 0.75 : 0.85;
      colors[i * 3 + 2] = isGold ? 0.2 : 0.95;
    }

    fluxGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    fluxGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const fluxMat = new THREE.PointsMaterial({
      size: 0.065,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    const fluxParticles = new THREE.Points(fluxGeo, fluxMat);
    fluxParticlesRef.current = fluxParticles;
    transformerGroup.add(fluxParticles);

    // 9. HIGH-VOLTAGE DISCHARGE SPARKS MESH (Pulse activation)
    const sparkGeo = new THREE.BufferGeometry();
    const sparkCount = 12;
    const sparkPositions = new Float32Array(sparkCount * 6);
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3));
    const sparkMat = new THREE.LineBasicMaterial({
      color: 0x67e8f9,
      linewidth: 2,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0
    });
    const sparkMesh = new THREE.LineSegments(sparkGeo, sparkMat);
    sparkMeshRef.current = sparkMesh;
    hvGroup.add(sparkMesh);

    // RESIZE OBSERVER
    const handleResize = () => {
      if (!container || !cameraRef.current || !rendererRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // ANIMATION LOOP
    let animationFrameId: number;
    let lastTime = performance.now();
    const startTime = performance.now();

    const render = () => {
      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      const time = (now - startTime) / 1000;

      // Rotation damping / interactive control
      if (partsGroupRef.current) {
        if (autoRotate && !isDraggingRef.current) {
          rotationTarget.current.y += delta * 0.22;
        }
        partsGroupRef.current.rotation.y += (rotationTarget.current.y - partsGroupRef.current.rotation.y) * 0.08;
        partsGroupRef.current.rotation.x += (rotationTarget.current.x - partsGroupRef.current.rotation.x) * 0.08;
      }

      // Rotate electromagnetic particles
      if (fluxParticlesRef.current) {
        fluxParticlesRef.current.rotation.y -= delta * 0.45;
        fluxParticlesRef.current.rotation.z = Math.sin(time * 0.8) * 0.1;
      }

      // Render scene
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // CLEANUP
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
    };
  }, []);

  // Update exploded view slider offsets
  useEffect(() => {
    const factor = explodedVal; // 0 to 1
    if (bushingsHVRef.current) {
      bushingsHVRef.current.position.y = 1.1 + factor * 1.5;
    }
    if (bushingsMVRef.current) {
      bushingsMVRef.current.position.y = 1.1 + factor * 1.2;
    }
    if (radiatorsLeftRef.current) {
      radiatorsLeftRef.current.position.x = -1.4 - factor * 1.3;
    }
    if (radiatorsRightRef.current) {
      radiatorsRightRef.current.position.x = 1.4 + factor * 1.3;
    }
    if (conservatorRef.current) {
      conservatorRef.current.position.y = 2.5 + factor * 1.8;
    }
    if (coreRef.current) {
      coreRef.current.visible = factor > 0.05 || wireframeMode;
      coreRef.current.position.y = factor * 0.4;
    }
    if (tankMeshRef.current) {
      const mat = tankMeshRef.current.material as THREE.MeshStandardMaterial;
      if (wireframeMode) {
        mat.wireframe = true;
        mat.opacity = 0.35;
        mat.transparent = true;
      } else {
        mat.wireframe = false;
        mat.opacity = factor > 0.4 ? 0.35 : 1.0;
        mat.transparent = factor > 0.4;
      }
    }
  }, [explodedVal, wireframeMode]);

  // Update flux field visibility
  useEffect(() => {
    if (fluxParticlesRef.current) {
      fluxParticlesRef.current.visible = fluxVisible;
    }
  }, [fluxVisible]);

  // Trigger high voltage pulse
  const triggerPulse = () => {
    setVoltagePulse(true);
    soundFx.playDischarge();

    if (sparkMeshRef.current) {
      const mat = sparkMeshRef.current.material as THREE.LineBasicMaterial;
      mat.opacity = 1.0;

      // Generate random lightning arc vertices between bushings
      const posAttr = sparkMeshRef.current.geometry.getAttribute('position') as THREE.BufferAttribute;
      const array = posAttr.array as Float32Array;

      for (let i = 0; i < 12; i++) {
        const x1 = -0.6 + Math.random() * 0.3;
        const y1 = 1.75;
        const z1 = 0;

        const x2 = 0.6 - Math.random() * 0.3;
        const y2 = 1.75 + (Math.random() - 0.5) * 0.4;
        const z2 = (Math.random() - 0.5) * 0.2;

        array[i * 6] = x1;
        array[i * 6 + 1] = y1;
        array[i * 6 + 2] = z1;
        array[i * 6 + 3] = x2;
        array[i * 6 + 4] = y2;
        array[i * 6 + 5] = z2;
      }
      posAttr.needsUpdate = true;

      setTimeout(() => {
        mat.opacity = 0;
        setVoltagePulse(false);
      }, 350);
    }
  };

  // Mouse & Touch Orbit Event Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    prevMousePos.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - prevMousePos.current.x;
    const deltaY = e.clientY - prevMousePos.current.y;
    prevMousePos.current = { x: e.clientX, y: e.clientY };

    rotationTarget.current.y += deltaX * 0.007;
    rotationTarget.current.x = Math.max(-0.4, Math.min(0.8, rotationTarget.current.x + deltaY * 0.007));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
  };

  // Preset view positioning
  const setPresetView = (view: 'iso' | 'hv' | 'rad' | 'front') => {
    soundFx.playSwitchClick();
    setAutoRotate(false);
    if (view === 'iso') {
      rotationTarget.current = { x: 0.35, y: -0.6 };
      setActivePart('tank');
    } else if (view === 'hv') {
      rotationTarget.current = { x: 0.55, y: 0.2 };
      setActivePart('bushingsHV');
    } else if (view === 'rad') {
      rotationTarget.current = { x: 0.2, y: 1.55 };
      setActivePart('radiators');
    } else if (view === 'front') {
      rotationTarget.current = { x: 0.1, y: 0 };
      setActivePart('conservator');
    }
  };

  const currentInfo = PARTS_INFO[activePart] || PARTS_INFO.tank;

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-border/70 bg-[#060c14] shadow-2xl transition-all duration-300 ${
      isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen' : 'h-[640px] md:h-[720px]'
    }`}>
      {/* 3D Canvas Mount */}
      <div 
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
      />

      {/* TOP HEADER HUD OVERLAY */}
      <div className="absolute top-0 left-0 right-0 p-2 sm:p-4 md:p-6 flex flex-wrap items-center justify-between gap-2 sm:gap-3 pointer-events-none">
        <div className="flex items-center gap-2 sm:gap-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm pointer-events-auto">
          <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-[10px] sm:text-xs font-semibold text-[#0A3D4A] dark:text-cyan-400 uppercase tracking-wider sm:tracking-widest">
            3D DIGITAL TWIN • SUBESTAÇÃO ATÉ 500 kV
          </span>
          <span className="hidden sm:inline-block text-[11px] font-mono text-slate-500 dark:text-slate-400 border-l border-slate-200 dark:border-slate-700 pl-2">
            NBR 5356 / IEC 60076
          </span>
        </div>

        {/* View presets */}
        <div className="flex items-center gap-1 sm:gap-1.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm pointer-events-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setPresetView('iso')}
            className="px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-mono font-medium rounded-lg text-slate-700 hover:text-slate-950 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
          >
            Geral
          </button>
          <button
            onClick={() => setPresetView('hv')}
            className="px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-mono font-medium rounded-lg text-slate-700 hover:text-slate-950 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
          >
            Buchas 500kV
          </button>
          <button
            onClick={() => setPresetView('rad')}
            className="px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-mono font-medium rounded-lg text-slate-700 hover:text-slate-950 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
          >
            Radiadores
          </button>
          <button
            onClick={() => setPresetView('front')}
            className="px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-mono font-medium rounded-lg text-slate-700 hover:text-slate-950 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
          >
            Conservador
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            aria-label="Alternar tela cheia"
            className="p-1 sm:p-1.5 ml-0.5 sm:ml-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* TECHNICAL INSPECTION HUD CARD (LEFT SIDE) */}
      <div className="absolute top-24 sm:top-20 left-2 sm:left-4 md:left-6 max-w-[calc(100vw-3rem)] sm:max-w-sm pointer-events-none">
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl pointer-events-auto transition-all">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-slate-800">
            <span className="font-mono text-[11px] font-bold text-[#996515] dark:text-[#C9A227] uppercase">
              {currentInfo.tag} • {currentInfo.norm}
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-teal-50 dark:bg-cyan-950/50 text-[#0A3D4A] dark:text-cyan-400 border border-teal-200 dark:border-cyan-800 font-bold">
              CLASSE 500 kV
            </span>
          </div>
          <h4 className="text-sm font-bold text-slate-950 dark:text-white mb-1.5 flex items-center gap-1.5">
            <Box className="w-4 h-4 text-[#0A3D4A] dark:text-cyan-400 shrink-0" />
            {currentInfo.name}
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            {currentInfo.desc}
          </p>

          <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[10px]">POTÊNCIA BASE:</span>
              <span className="font-bold text-slate-900 dark:text-white">30 / 40 MVA</span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[10px]">ELEVAÇÃO TEMP:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">65°C / ONAN</span>
            </div>
          </div>
        </div>
      </div>

      {/* ERGONOMIC COLLAPSIBLE BOTTOM CONTROLS DOCK */}
      <div className="absolute bottom-4 left-4 right-4 md:left-6 md:right-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pointer-events-none">
        {/* Exploded View Slider */}
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3 shadow-lg pointer-events-auto min-w-[260px]">
          <Sliders className="w-4 h-4 text-[#996515] dark:text-[#C9A227] shrink-0" />
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[11px] font-mono font-bold text-slate-900 dark:text-white">Vista Explodida</span>
              <span className="text-[10px] font-mono text-[#996515] dark:text-[#C9A227] font-bold">{Math.round(explodedVal * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={explodedVal}
              onChange={(e) => {
                setExplodedVal(parseFloat(e.target.value));
                if (explodedVal === 0) soundFx.playSwitchClick();
              }}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#996515] dark:accent-[#C9A227]"
            />
          </div>
        </div>

        {/* Action Toggles */}
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-1 shadow-lg pointer-events-auto">
          {/* High Voltage Arc Simulation */}
          <button
            onClick={triggerPulse}
            disabled={voltagePulse}
            className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              voltagePulse 
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/50 scale-105'
                : 'bg-teal-50 dark:bg-cyan-950/50 text-[#0A3D4A] dark:text-cyan-400 hover:bg-teal-100 dark:hover:bg-cyan-900/50 border border-teal-300 dark:border-cyan-800'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${voltagePulse ? 'animate-bounce text-black' : ''}`} />
            {voltagePulse ? 'DESCARGA ATIVA' : 'Disparo Dielétrico'}
          </button>

          {/* Wireframe / X-Ray Mode */}
          <button
            onClick={() => {
              setWireframeMode(!wireframeMode);
              soundFx.playSwitchClick();
            }}
            className={`px-3 py-1.5 text-xs font-mono font-medium rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              wireframeMode 
                ? 'bg-[#996515] dark:bg-[#C9A227] text-white dark:text-slate-950 font-bold' 
                : 'text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Raio-X Núcleo
          </button>

          {/* Flux Field Toggle */}
          <button
            onClick={() => {
              setFluxVisible(!fluxVisible);
              soundFx.playSwitchClick();
            }}
            className={`px-3 py-1.5 text-xs font-mono font-medium rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              fluxVisible 
                ? 'text-[#0A3D4A] dark:text-cyan-400 bg-teal-50 dark:bg-cyan-950/40 border border-teal-300 dark:border-cyan-800/50 font-bold' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Campo Magnético
          </button>

          {/* Auto rotate toggle */}
          <button
            onClick={() => {
              setAutoRotate(!autoRotate);
              soundFx.playSwitchClick();
            }}
            className={`p-1.5 rounded-lg text-slate-700 hover:text-black dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
              autoRotate ? 'text-[#0A3D4A] dark:text-cyan-400' : 'text-slate-500 dark:text-slate-400'
            }`}
            title="Giro automático"
          >
            <RotateCcw className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
          </button>
        </div>
      </div>

      {/* Touch / Mouse Instruction Hint */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 pointer-events-none hidden md:block">
        <span className="text-[10px] font-mono text-slate-700 dark:text-slate-300 bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm font-medium">
          Arraste para orbitar 360° • Use a Vista Explodida para separar componentes internos
        </span>
      </div>
    </div>
  );
};
