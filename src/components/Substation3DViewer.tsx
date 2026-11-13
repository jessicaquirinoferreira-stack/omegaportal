import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import gsap from 'gsap';
import {
  Play,
  Pause,
  RotateCcw,
  Layers,
  Sparkles,
  Zap,
  Crosshair,
  Tag,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronUp,
  Eye,
  X,
  Box,
  Compass,
  Gauge,
} from 'lucide-react';
import { soundFx } from '../utils/soundEffects';
import {
  PartId,
  CAMERA_PRESETS,
  CameraPreset,
  TRANSFORMER_PARTS_CATALOG,
  computeExplodedOffsets,
  getActiveDisassemblyPhase,
  clamp01,
} from '../utils/transformerKinematics';
import { createProceduralTextures } from './transformer3d/proceduralTextures';
import { createTransformerMaterials } from './transformer3d/materialsLibrary';
import { buildTransformerModel, TransformerAssembly } from './transformer3d/buildTransformerModel';
import { createMagneticFluxRig, createDielectricArcRig } from './transformer3d/effectsRig';

interface ProjectedCallout {
  id: PartId;
  tag: string;
  label: string;
  x: number;
  y: number;
  visible: boolean;
}

const INTERNAL_PARTS = new Set<PartId>(['core', 'windingsHV', 'windingsLV', 'insulation']);

const CALLOUT_LABELS: { id: PartId; short: string }[] = [
  { id: 'bushingsHV', short: 'Buchas AT' },
  { id: 'bushingsMV', short: 'Buchas MT' },
  { id: 'conservator', short: 'Conservador / Buchholz' },
  { id: 'radiators', short: 'Radiadores ONAN' },
  { id: 'tank', short: 'Tanque Principal' },
  { id: 'tankCover', short: 'Tampa Flangeada' },
  { id: 'core', short: 'Núcleo Laminado' },
  { id: 'windingsHV', short: 'Enrolamento AT' },
  { id: 'windingsLV', short: 'Enrolamento MT' },
  { id: 'insulation', short: 'Isolamento Dielétrico' },
  { id: 'kiosk', short: 'Armário Comando' },
];

// Reusable module-scope scratch objects (zero GC inside animation loop)
const _projVec = new THREE.Vector3();

export const Substation3DViewer: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasMountRef = useRef<HTMLDivElement>(null);

  // React UI state
  const [explodedTarget, setExplodedTarget] = useState<number>(0);
  const [animState, setAnimState] = useState<'idle' | 'disassembling' | 'assembling'>('idle');
  const [animSpeed, setAnimSpeed] = useState<0.5 | 1 | 2>(1);
  const [xrayMode, setXrayMode] = useState<boolean>(false);
  const [fluxVisible, setFluxVisible] = useState<boolean>(false);
  const [inspectionMode, setInspectionMode] = useState<boolean>(true);
  const [labelsVisible, setLabelsVisible] = useState<boolean>(true);
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [dielectricPulse, setDielectricPulse] = useState<boolean>(false);
  const [selectedPart, setSelectedPart] = useState<PartId | null>(null);
  const [hoveredPart, setHoveredPart] = useState<PartId | null>(null);
  const [activePreset, setActivePreset] = useState<CameraPreset['id']>('iso');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [dockCollapsed, setDockCollapsed] = useState<boolean>(false);
  const [calloutPoints, setCalloutPoints] = useState<{ items: ProjectedCallout[]; midX: number }>({
    items: [],
    midX: 500,
  });

  // Mutable refs read by WebGL loop without re-creating canvas
  const stateRef = useRef({
    explodedTarget: 0,
    explodedCurrent: 0,
    xrayMode: false,
    fluxVisible: false,
    inspectionMode: true,
    labelsVisible: true,
    autoRotate: false,
    selectedPart: null as PartId | null,
    hoveredPart: null as PartId | null,
  });

  // WebGL & rig handles
  const threeRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    controls: OrbitControls;
    assembly: TransformerAssembly;
    materials: ReturnType<typeof createTransformerMaterials>;
    fluxRig: ReturnType<typeof createMagneticFluxRig>;
    arcRig: ReturnType<typeof createDielectricArcRig>;
    requestRender: () => void;
    cameraTween: gsap.core.Tween | null;
    explodeTween: gsap.core.Tween | null;
    explodeProxy: { value: number };
    isSoftwareGl: boolean;
  } | null>(null);

  // Keep refs synced with React state
  useEffect(() => {
    stateRef.current.explodedTarget = explodedTarget;
    threeRef.current?.requestRender();
  }, [explodedTarget]);

  useEffect(() => {
    stateRef.current.xrayMode = xrayMode;
    if (threeRef.current) {
      threeRef.current.materials.setXrayMode(xrayMode);
      threeRef.current.assembly.xrayHelpers.forEach((h) => {
        h.visible = xrayMode;
      });
      threeRef.current.requestRender();
    }
  }, [xrayMode]);

  useEffect(() => {
    stateRef.current.fluxVisible = fluxVisible;
    if (threeRef.current) {
      threeRef.current.fluxRig.setVisible(fluxVisible);
      threeRef.current.requestRender();
    }
  }, [fluxVisible]);

  useEffect(() => {
    stateRef.current.inspectionMode = inspectionMode;
  }, [inspectionMode]);

  useEffect(() => {
    stateRef.current.labelsVisible = labelsVisible;
    threeRef.current?.requestRender();
  }, [labelsVisible]);

  useEffect(() => {
    stateRef.current.autoRotate = autoRotate;
    if (threeRef.current) {
      threeRef.current.controls.autoRotate = autoRotate && !threeRef.current.isSoftwareGl;
      threeRef.current.requestRender();
    }
  }, [autoRotate]);

  useEffect(() => {
    stateRef.current.selectedPart = selectedPart;
    stateRef.current.hoveredPart = hoveredPart;
    if (threeRef.current) {
      threeRef.current.materials.setPartHighlight(selectedPart, hoveredPart);
      threeRef.current.requestRender();
    }
  }, [selectedPart, hoveredPart]);

  // Initialize Three.js Scene Once
  useEffect(() => {
    const mount = canvasMountRef.current;
    if (!mount) return;

    // Software WebGL detection via renderer string
    const isSoftwareGl = (() => {
      try {
        const probeCanvas = document.createElement('canvas');
        const gl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param) || '');
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    const width = Math.max(mount.clientWidth, 320);
    const height = Math.max(mount.clientHeight, 320);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b1117);
    scene.fog = new THREE.FogExp2(0x0b1117, 0.022);

    // Mandatory studio environment map for realistic PBR metals & glazed porcelain
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envScene = new RoomEnvironment();
    const envTarget = pmremGenerator.fromScene(envScene, 0.04);
    scene.environment = envTarget.texture;
    envScene.dispose();
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 80);
    camera.position.set(6.8, 4.4, 7.6);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1.55, 0);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.065;
    controls.minDistance = 2.1;
    controls.maxDistance = 17.5;
    controls.maxPolarAngle = Math.PI * 0.492;
    controls.autoRotateSpeed = 0.9;
    controls.update();

    // 3-Point Studio Industrial Lighting + Warm/Cool Contrast
    const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x1e293b, 0.85);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff5e4, 2.7);
    keyLight.position.set(7.5, 11.0, 6.5);
    keyLight.castShadow = !isSoftwareGl;
    if (!isSoftwareGl) {
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.camera.near = 1;
      keyLight.shadow.camera.far = 30;
      keyLight.shadow.camera.left = -6;
      keyLight.shadow.camera.right = 6;
      keyLight.shadow.camera.top = 6;
      keyLight.shadow.camera.bottom = -6;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xcbe4ff, 1.15);
    fillLight.position.set(-7.5, 5.5, 4.5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xe2e8f0, 1.4);
    rimLight.position.set(0.5, 6.5, -8.5);
    scene.add(rimLight);

    // Studio softbox panels for realistic specular highlights (GPU only)
    if (!isSoftwareGl) {
      RectAreaLightUniformsLib.init();
      const softboxA = new THREE.RectAreaLight(0xffffff, 2.2, 6, 3);
      softboxA.position.set(4.5, 6.5, 4.5);
      softboxA.lookAt(0, 1.5, 0);
      scene.add(softboxA);

      const softboxB = new THREE.RectAreaLight(0xdbeafe, 1.6, 5, 3);
      softboxB.position.set(-5.0, 5.0, -3.5);
      softboxB.lookAt(0, 1.5, 0);
      scene.add(softboxB);
    }

    // Subtle industrial bay floor & technical grid
    const floorGeo = new THREE.CircleGeometry(28, 48);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0e151d,
      roughness: 0.92,
      metalness: 0.08,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -0.285;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    const gridHelper = new THREE.GridHelper(22, 44, 0x334155, 0x1a2430);
    gridHelper.position.y = -0.275;
    scene.add(gridHelper);

    // Build Procedural PBR Textures, Materials & High-Detail Transformer Model
    const textures = createProceduralTextures(renderer.capabilities.getMaxAnisotropy());
    const materials = createTransformerMaterials(textures, isSoftwareGl);
    const assembly = buildTransformerModel(materials, textures, isSoftwareGl);
    scene.add(assembly.root);

    // Effects Rigs
    const fluxRig = createMagneticFluxRig(assembly.groups.core);
    fluxRig.setVisible(stateRef.current.fluxVisible);
    const arcRig = createDielectricArcRig(assembly.groups.bushingsHV, assembly.hvArcPoints);

    // Pre-compile shaders on GPU
    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Animation & Render Loop Management
    let frameId = 0;
    let disposed = false;
    let renderBusy = false;
    let renderDirty = false;
    let lastTime = performance.now();
    let elapsedTotal = 0;
    let lastCalloutTime = 0;

    const explodeProxy = { value: 0 };

    const applyOffsets = (p: number) => {
      const o = computeExplodedOffsets(p);
      assembly.groups.bushingsHV.position.set(...o.bushingsHV);
      assembly.groups.bushingsMV.position.set(...o.bushingsMV);
      assembly.groups.conservator.position.set(...o.conservator);
      assembly.groups.radiatorsLeft.position.set(...o.radiatorsLeft);
      assembly.groups.radiatorsRight.position.set(...o.radiatorsRight);
      assembly.groups.kiosk.position.set(...o.kiosk);
      assembly.groups.tankCover.position.set(...o.tankCover);
      assembly.groups.tankBody.position.set(...o.tankBody);
      assembly.groups.insulation.position.set(...o.insulation);
      assembly.groups.windingsHV.position.set(...o.windingsHV);
      assembly.groups.windingsLV.position.set(...o.windingsLV);
      assembly.groups.core.position.set(...o.core);
    };

    const updateProjectedCallouts = (now: number) => {
      if (!stateRef.current.labelsVisible || now - lastCalloutTime < 90) return;
      lastCalloutTime = now;
      const cw = renderer.domElement.clientWidth;
      const ch = renderer.domElement.clientHeight;
      if (!cw || !ch) return;

      const showInternal = stateRef.current.explodedCurrent >= 0.25 || stateRef.current.xrayMode;

      const items: ProjectedCallout[] = CALLOUT_LABELS.filter(
        (item) => showInternal || !INTERNAL_PARTS.has(item.id)
      ).map((item) => {
        const anchor = assembly.calloutAnchors[item.id];
        anchor.getWorldPosition(_projVec);
        _projVec.project(camera);
        const x = ((_projVec.x + 1) / 2) * cw;
        const y = ((-_projVec.y + 1) / 2) * ch;
        const inSafeZone =
          _projVec.z > -1 &&
          _projVec.z < 1 &&
          x > 48 &&
          x < cw - 48 &&
          y > 90 &&
          y < ch - 135;
        return {
          id: item.id,
          tag: TRANSFORMER_PARTS_CATALOG[item.id].tag,
          label: item.short,
          x,
          y,
          visible: inSafeZone,
        };
      });
      setCalloutPoints({ items, midX: cw / 2 });
    };

    const afterDraw = (cb: () => void) => {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (gl && typeof gl.fenceSync === 'function') {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        let polls = 0;
        const poll = () => {
          if (disposed) {
            if (sync) gl.deleteSync(sync);
            return;
          }
          polls += 1;
          const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (state === gl.UNSIGNALED && polls < 5) {
            frameId = window.setTimeout(poll, 6);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 20);
          }
        };
        frameId = window.setTimeout(poll, 6);
      } else {
        frameId = window.setTimeout(cb, 28);
      }
    };

    const stepScene = (now: number) => {
      const delta = Math.max(0.0001, Math.min((now - lastTime) / 1000, 0.1));
      lastTime = now;
      elapsedTotal += delta;

      // Exponential damping toward target exploded value (unless GSAP tween is directly driving it)
      if (!threeRef.current?.explodeTween?.isActive()) {
        stateRef.current.explodedCurrent = THREE.MathUtils.damp(
          stateRef.current.explodedCurrent,
          stateRef.current.explodedTarget,
          7.5,
          delta
        );
      } else {
        stateRef.current.explodedCurrent = explodeProxy.value;
      }

      applyOffsets(stateRef.current.explodedCurrent);
      fluxRig.update(elapsedTotal);
      const arcActive = arcRig.update(delta);
      controls.update();

      renderer.render(scene, camera);
      updateProjectedCallouts(now);

      const needsMoreFrames =
        Math.abs(stateRef.current.explodedCurrent - stateRef.current.explodedTarget) > 0.0008 ||
        stateRef.current.fluxVisible ||
        arcActive ||
        (stateRef.current.autoRotate && !isSoftwareGl) ||
        Boolean(threeRef.current?.cameraTween?.isActive()) ||
        Boolean(threeRef.current?.explodeTween?.isActive());

      return needsMoreFrames;
    };

    const requestRender = () => {
      if (disposed) return;
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = requestAnimationFrame((now) => {
        if (disposed) {
          renderBusy = false;
          return;
        }
        renderDirty = false;
        let keepRunning = false;
        try {
          keepRunning = stepScene(now);
        } catch (err) {
          console.error('[Substation3DViewer] render error:', err);
        }
        const done = () => {
          renderBusy = false;
          if (renderDirty || keepRunning) {
            requestRender();
          }
        };
        if (isSoftwareGl) {
          afterDraw(done);
        } else {
          done();
        }
      });
    };

    // Controls events
    const onControlStart = () => {
      if (threeRef.current?.cameraTween) {
        threeRef.current.cameraTween.kill();
        threeRef.current.cameraTween = null;
      }
      if (stateRef.current.autoRotate) {
        setAutoRotate(false);
      }
      requestRender();
    };
    const onControlChange = () => {
      requestRender();
    };
    controls.addEventListener('start', onControlStart);
    controls.addEventListener('change', onControlChange);

    // Raycasting for component inspection (Click & Throttled Hover)
    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2();
    let pointerDownPos = { x: 0, y: 0 };
    let lastHoverCheck = 0;

    const pickPart = (clientX: number, clientY: number): PartId | null => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointerNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointerNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointerNdc, camera);
      const hits = raycaster.intersectObjects(assembly.interactables, false);
      if (hits.length > 0) {
        const hitObj = hits[0].object;
        return (hitObj.userData.partId as PartId) || null;
      }
      return null;
    };

    const onPointerDown = (e: PointerEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!stateRef.current.inspectionMode) return;
      const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
      if (dist > 6) return; // Was an orbit drag, not a click
      const picked = pickPart(e.clientX, e.clientY);
      if (picked) {
        soundFx.playSwitchClick();
        setSelectedPart(picked);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!stateRef.current.inspectionMode) {
        renderer.domElement.style.cursor = 'grab';
        return;
      }
      const now = performance.now();
      if (now - lastHoverCheck < 55) return;
      lastHoverCheck = now;
      const hovered = pickPart(e.clientX, e.clientY);
      renderer.domElement.style.cursor = hovered ? 'pointer' : 'grab';
      if (hovered !== stateRef.current.hoveredPart) {
        setHoveredPart(hovered);
      }
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('pointermove', onPointerMove);

    // ResizeObserver
    const resizeObserver = new ResizeObserver(() => {
      if (!mount || disposed) return;
      const w = Math.max(mount.clientWidth, 280);
      const h = Math.max(mount.clientHeight, 280);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      requestRender();
    });
    resizeObserver.observe(mount);

    threeRef.current = {
      renderer,
      scene,
      camera,
      controls,
      assembly,
      materials,
      fluxRig,
      arcRig,
      requestRender,
      cameraTween: null,
      explodeTween: null,
      explodeProxy,
      isSoftwareGl,
    };

    // Initial render
    requestRender();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      controls.removeEventListener('start', onControlStart);
      controls.removeEventListener('change', onControlChange);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);

      threeRef.current?.cameraTween?.kill();
      threeRef.current?.explodeTween?.kill();

      controls.dispose();
      fluxRig.dispose();
      arcRig.dispose();
      assembly.dispose();
      materials.dispose();
      textures.dispose();
      floorGeo.dispose();
      floorMat.dispose();
      envTarget.dispose();
      renderer.dispose();
      scene.clear();

      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      threeRef.current = null;
    };
  }, []);

  // Smooth GSAP Camera Flight Helper
  const flyCameraTo = useCallback(
    (pos: [number, number, number], target: [number, number, number]) => {
      const ctx = threeRef.current;
      if (!ctx) return;
      ctx.cameraTween?.kill();

      const fromPos = {
        px: ctx.camera.position.x,
        py: ctx.camera.position.y,
        pz: ctx.camera.position.z,
        tx: ctx.controls.target.x,
        ty: ctx.controls.target.y,
        tz: ctx.controls.target.z,
      };

      ctx.cameraTween = gsap.to(fromPos, {
        px: pos[0],
        py: pos[1],
        pz: pos[2],
        tx: target[0],
        ty: target[1],
        tz: target[2],
        duration: 0.95,
        ease: 'power3.out',
        onUpdate: () => {
          ctx.camera.position.set(fromPos.px, fromPos.py, fromPos.pz);
          ctx.controls.target.set(fromPos.tx, fromPos.ty, fromPos.tz);
          ctx.requestRender();
        },
        onComplete: () => {
          ctx.cameraTween = null;
          ctx.requestRender();
        },
      });
    },
    []
  );

  // Smooth GSAP Exploded View Choreography (Assemble / Disassemble / Pause / Reset)
  const animateExplodeTo = useCallback(
    (targetVal: number, mode: 'disassembling' | 'assembling') => {
      const ctx = threeRef.current;
      if (!ctx) {
        setExplodedTarget(targetVal);
        return;
      }
      ctx.explodeTween?.kill();
      ctx.explodeProxy.value = stateRef.current.explodedCurrent;
      const dist = Math.abs(targetVal - ctx.explodeProxy.value);
      if (dist < 0.01) {
        setExplodedTarget(targetVal);
        setAnimState('idle');
        return;
      }

      setAnimState(mode);
      const duration = Math.max(0.4, (dist * 3.6) / animSpeed);
      let lastUiSync = 0;

      ctx.explodeTween = gsap.to(ctx.explodeProxy, {
        value: targetVal,
        duration,
        ease: 'power2.inOut',
        onUpdate: () => {
          const val = clamp01(ctx.explodeProxy.value);
          stateRef.current.explodedTarget = val;
          stateRef.current.explodedCurrent = val;
          ctx.requestRender();
          const now = performance.now();
          if (now - lastUiSync >= 90) {
            lastUiSync = now;
            setExplodedTarget(val);
          }
        },
        onComplete: () => {
          ctx.explodeProxy.value = targetVal;
          stateRef.current.explodedTarget = targetVal;
          stateRef.current.explodedCurrent = targetVal;
          ctx.explodeTween = null;
          setAnimState('idle');
          setExplodedTarget(targetVal);
          ctx.requestRender();
        },
      });
    },
    [animSpeed]
  );

  const handlePauseAnim = () => {
    soundFx.playSwitchClick();
    if (threeRef.current?.explodeTween) {
      threeRef.current.explodeTween.kill();
      threeRef.current.explodeTween = null;
    }
    setAnimState('idle');
  };

  const handleResetAll = () => {
    soundFx.playSwitchClick();
    handlePauseAnim();
    setXrayMode(false);
    setFluxVisible(false);
    setSelectedPart(null);
    setActivePreset('iso');
    animateExplodeTo(0, 'assembling');
    flyCameraTo([6.8, 4.4, 7.6], [0, 1.55, 0]);
  };

  const handleSelectPreset = (preset: CameraPreset) => {
    soundFx.playSwitchClick();
    setActivePreset(preset.id);
    setAutoRotate(false);
    if (preset.minExplode !== undefined && explodedTarget < preset.minExplode) {
      animateExplodeTo(preset.minExplode, 'disassembling');
    } else if (preset.id === 'iso' && explodedTarget > 0.95) {
      // keep current exploded state if inspecting
    }
    flyCameraTo(preset.position, preset.target);
  };

  const handleFocusPart = (partId: PartId) => {
    const info = TRANSFORMER_PARTS_CATALOG[partId];
    const offsets = computeExplodedOffsets(stateRef.current.explodedCurrent);
    let dx = 0;
    let dy = 0;
    let dz = 0;
    if (partId === 'tank') [dx, dy, dz] = offsets.tankBody;
    else if (partId === 'tankCover') [dx, dy, dz] = offsets.tankCover;
    else if (partId === 'bushingsHV') [dx, dy, dz] = offsets.bushingsHV;
    else if (partId === 'bushingsMV') [dx, dy, dz] = offsets.bushingsMV;
    else if (partId === 'radiators') [dx, dy, dz] = offsets.radiatorsRight;
    else if (partId === 'conservator') [dx, dy, dz] = offsets.conservator;
    else if (partId === 'insulation') [dx, dy, dz] = offsets.insulation;
    else if (partId === 'windingsHV') [dx, dy, dz] = offsets.windingsHV;
    else if (partId === 'windingsLV') [dx, dy, dz] = offsets.windingsLV;
    else if (partId === 'core') [dx, dy, dz] = offsets.core;
    else if (partId === 'kiosk') [dx, dy, dz] = offsets.kiosk;

    const tx = info.focusTarget[0] + dx;
    const ty = info.focusTarget[1] + dy;
    const tz = info.focusTarget[2] + dz;

    // Auto-open X-Ray if user focuses an internal component while fully assembled & tank is closed
    if (
      (partId === 'core' || partId === 'windingsHV' || partId === 'windingsLV' || partId === 'insulation') &&
      stateRef.current.explodedCurrent < 0.35 &&
      !xrayMode
    ) {
      setXrayMode(true);
    }

    flyCameraTo(
      [tx + info.focusOffset[0], ty + info.focusOffset[1], tz + info.focusOffset[2]],
      [tx, ty, tz]
    );
  };

  const handleTriggerDielectric = () => {
    soundFx.playDischarge();
    setDielectricPulse(true);
    threeRef.current?.arcRig.trigger();
    threeRef.current?.requestRender();
    window.setTimeout(() => setDielectricPulse(false), 500);
  };

  const handleSliderChange = (val: number) => {
    if (threeRef.current?.explodeTween) {
      threeRef.current.explodeTween.kill();
      threeRef.current.explodeTween = null;
      setAnimState('idle');
    }
    setExplodedTarget(val);
  };

  const currentPhase = getActiveDisassemblyPhase(explodedTarget);
  const activePartInfo = selectedPart ? TRANSFORMER_PARTS_CATALOG[selectedPart] : null;

  return (
    <div
      ref={wrapperRef}
      data-testid="transformer-3d-viewer"
      data-exploded-percent={Math.round(explodedTarget * 100)}
      data-active-phase={currentPhase.phase}
      className={`relative w-full overflow-hidden border border-slate-800 bg-[#0b1117] shadow-2xl transition-all duration-300 select-none ${
        isFullscreen ? 'fixed inset-0 z-50 h-screen rounded-none' : 'h-[660px] md:h-[760px] rounded-2xl'
      }`}
    >
      {/* Dedicated WebGL Mount Container */}
      <div
        ref={canvasMountRef}
        data-testid="transformer-webgl-canvas"
        className="w-full h-full touch-none"
      />

      {/* 3D CALLOUT LEADER LINES & TECHNICAL TAGS (Toggleable) */}
      {labelsVisible && calloutPoints.items.length > 0 && (
        <div className="hidden sm:block absolute inset-0 pointer-events-none overflow-hidden">
          <svg className="w-full h-full">
            {calloutPoints.items
              .filter((pt) => pt.visible)
              .map((pt) => {
                const isSelected = selectedPart === pt.id;
                const isRight = pt.x > calloutPoints.midX;
                const offsetX = isRight ? 36 : -36;
                const offsetY = -18;
                return (
                  <g key={`line-${pt.id}`} opacity={selectedPart && !isSelected ? 0.28 : 0.88}>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isSelected ? 4.5 : 3}
                      fill={isSelected ? '#e5c158' : '#38bdf8'}
                    />
                    <polyline
                      points={`${pt.x},${pt.y} ${pt.x + offsetX * 0.65},${pt.y + offsetY} ${pt.x + offsetX},${pt.y + offsetY}`}
                      fill="none"
                      stroke={isSelected ? '#e5c158' : '#38bdf8'}
                      strokeWidth={isSelected ? 1.6 : 1}
                    />
                  </g>
                );
              })}
          </svg>
          {calloutPoints.items
            .filter((pt) => pt.visible)
            .map((pt) => {
              const isSelected = selectedPart === pt.id;
              const isRight = pt.x > calloutPoints.midX;
              return (
                <button
                  key={`tag-${pt.id}`}
                  type="button"
                  onClick={() => {
                    soundFx.playSwitchClick();
                    setSelectedPart(pt.id);
                  }}
                  style={{
                    left: `${pt.x + (isRight ? 38 : -38)}px`,
                    top: `${pt.y - 18}px`,
                    transform: isRight ? 'translate(0, -50%)' : 'translate(-100%, -50%)',
                  }}
                  className={`pointer-events-auto absolute px-2 py-0.5 rounded text-[10px] font-mono border transition-colors cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#C9A227] text-slate-950 border-amber-300 font-bold shadow-md'
                      : 'bg-slate-950/90 text-slate-200 border-slate-700 hover:border-cyan-400 hover:text-cyan-300'
                  } ${selectedPart && !isSelected ? 'opacity-40 hover:opacity-100' : 'opacity-95'}`}
                >
                  <span className="text-cyan-400 mr-1 font-bold">
                    {isSelected ? '●' : pt.tag}
                  </span>
                  {pt.label}
                </button>
              );
            })}
        </div>
      )}

      {/* TOP BAR HUD: Stacked Spec + Disclaimers (Left) & Camera Angle Presets (Right) */}
      <div className="absolute top-0 left-0 right-0 p-2.5 sm:p-4 flex flex-col lg:flex-row items-stretch lg:items-start justify-between gap-2 pointer-events-none">
        {/* Top-Left Spec & Active Mode Disclaimers (Stacked cleanly so they never overlap) */}
        <div className="flex flex-col gap-1.5 max-w-full lg:max-w-md pointer-events-none">
          <div className="bg-slate-950/92 border border-slate-800 rounded-xl px-3 py-2 shadow-lg pointer-events-auto">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="inline-block w-2 h-2 rounded-xs bg-[#C9A227]" />
              <span className="font-mono text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-slate-100">
                Transformador de Potência • 500 kV
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300">
                30/40 MVA • ONAN • 65 °C
              </span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] font-mono text-slate-400">
              <span className="text-[#e5c158] font-semibold">{currentPhase.title}</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Modelo visual ilustrativo de referência</span>
            </div>
          </div>

          {fluxVisible && (
            <div className="bg-slate-950/94 border border-cyan-800/80 text-cyan-200 px-3 py-1 rounded-lg text-[10px] font-mono shadow-md">
              Campo Magnético: visualização conceitual didática (não é simulação FEM calculada).
            </div>
          )}
          {dielectricPulse && (
            <div className="bg-slate-950/94 border border-sky-500 text-sky-200 px-3 py-1 rounded-lg text-[10px] font-mono shadow-md">
              Disparo Dielétrico: efeito visual ilustrativo (não representa ensaio normativo real).
            </div>
          )}
        </div>

        {/* Top-Right Camera Angle Presets & Fullscreen */}
        <div className="flex items-center gap-1 bg-slate-950/92 border border-slate-800 p-1 rounded-xl shadow-lg pointer-events-auto overflow-x-auto max-w-full no-scrollbar self-start lg:self-auto">
          <Compass className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5 shrink-0 hidden sm:block" />
          {CAMERA_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className={`px-2 py-1 text-[10px] sm:text-[11px] font-mono rounded-lg transition-colors shrink-0 cursor-pointer ${
                activePreset === preset.id
                  ? 'bg-[#C9A227] text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {preset.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setIsFullscreen((prev) => !prev)}
            aria-label={isFullscreen ? 'Sair da tela expandida' : 'Tela expandida'}
            className="p-1.5 ml-0.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors shrink-0 cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* SELECTED COMPONENT TECHNICAL INSPECTOR DRAWER (Non-occluding, Dismissible) */}
      {activePartInfo && (
        <aside
          aria-label="Ficha Técnica do Componente Selecionado"
          className="absolute top-24 sm:top-20 right-2.5 sm:right-4 w-[calc(100%-1.25rem)] sm:w-76 bg-slate-950/95 border border-slate-700 rounded-xl p-3 sm:p-3.5 shadow-2xl pointer-events-auto z-20 max-h-[42%] sm:max-h-[48%] overflow-y-auto"
        >
          <div className="flex items-start justify-between gap-2 pb-2 mb-2 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-[#e5c158] border border-amber-500/30">
                  {activePartInfo.tag}
                </span>
                <span className="text-[10px] font-mono text-slate-400">{activePartInfo.norm}</span>
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-white mt-1 flex items-center gap-1.5">
                <Box className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                {activePartInfo.name}
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setSelectedPart(null)}
              aria-label="Fechar ficha do componente"
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 text-[11px] leading-relaxed text-slate-300">
            <div>
              <span className="font-mono text-[10px] uppercase text-cyan-400 block">Função</span>
              <p>{activePartInfo.functionText}</p>
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase text-cyan-400 block">Importância</span>
              <p>{activePartInfo.importanceText}</p>
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase text-cyan-400 block">Localização & Relações</span>
              <p>
                {activePartInfo.locationText} {activePartInfo.relationshipsText}
              </p>
            </div>
            <p className="text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800">
              Nota: {activePartInfo.illustrativeNote}
            </p>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleFocusPart(activePartInfo.id)}
              className="flex-1 px-2.5 py-1.5 rounded-lg bg-[#C9A227] hover:bg-[#dfb535] text-slate-950 font-mono text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              Focar Componente
            </button>
          </div>
        </aside>
      )}

      {/* ERGONOMIC COLLAPSIBLE BOTTOM CONTROL DOCK */}
      <div
        className={`absolute left-1/2 -translate-x-1/2 z-20 transition-transform duration-300 w-[min(860px,94%)] pointer-events-none ${
          dockCollapsed ? 'bottom-0 translate-y-[calc(100%-34px)]' : 'bottom-3'
        }`}
      >
        {/* Collapse / Expand Toggle Handle */}
        <div className="flex justify-center mb-1">
          <button
            type="button"
            onClick={() => setDockCollapsed((prev) => !prev)}
            className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-t-lg bg-slate-950/92 border border-b-0 border-slate-800 text-[10px] font-mono text-slate-300 hover:text-white cursor-pointer"
          >
            {dockCollapsed ? (
              <>
                <ChevronUp className="w-3.5 h-3.5 text-[#C9A227]" />
                Mostrar Controles
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5 text-[#C9A227]" />
                Ocultar Controles
              </>
            )}
          </button>
        </div>

        {/* Main Consolidated Dock */}
        <div className="pointer-events-auto bg-slate-950/94 border border-slate-800 rounded-xl p-2 sm:p-3 shadow-2xl space-y-2">
          {/* Row 1: Disassembly Controls + Slider + Speed */}
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  soundFx.playSwitchClick();
                  animateExplodeTo(1, 'disassembling');
                }}
                disabled={explodedTarget > 0.98 && animState === 'idle'}
                className="px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-[11px] font-mono font-bold bg-[#C9A227] hover:bg-[#dfb535] disabled:opacity-45 text-slate-950 flex items-center gap-1 cursor-pointer"
              >
                <Play className="w-3 h-3 fill-current" />
                Desmontar
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFx.playSwitchClick();
                  animateExplodeTo(0, 'assembling');
                }}
                disabled={explodedTarget < 0.02 && animState === 'idle'}
                className="px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-[11px] font-mono font-medium bg-slate-800 hover:bg-slate-700 disabled:opacity-45 text-slate-100 border border-slate-700 cursor-pointer"
              >
                Montar
              </button>

              <button
                type="button"
                onClick={handlePauseAnim}
                disabled={animState === 'idle'}
                className="px-2 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-[11px] font-mono bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-200 border border-slate-700 flex items-center gap-1 cursor-pointer"
                title="Pausar animação de desmontagem"
              >
                <Pause className="w-3 h-3" />
                Pausar
              </button>

              <button
                type="button"
                onClick={handleResetAll}
                className="px-2 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-[11px] font-mono bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 flex items-center gap-1 cursor-pointer"
                title="Reiniciar visualização e montagem"
              >
                <RotateCcw className="w-3 h-3" />
                Reiniciar
              </button>
            </div>

            {/* 0% - 100% Exploded Slider + Speed */}
            <div className="flex-1 flex items-center gap-2 px-0.5">
              <label htmlFor="exploded-slider" className="text-[10px] font-mono text-slate-400 shrink-0 hidden sm:inline">
                Desmontagem
              </label>
              <input
                id="exploded-slider"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={explodedTarget}
                onChange={(e) => handleSliderChange(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#C9A227]"
              />
              <span className="text-[10px] sm:text-[11px] font-mono font-bold text-[#e5c158] w-9 text-right tabular-nums">
                {Math.round(explodedTarget * 100)}%
              </span>

              {/* Animation Speed Control */}
              <div className="flex items-center gap-0.5 sm:gap-1 shrink-0 border-l border-slate-800 pl-1.5 sm:pl-2">
                <Gauge className="w-3.5 h-3.5 text-slate-400 mr-0.5 hidden sm:block" />
                {([0.5, 1, 2] as const).map((spd) => (
                  <button
                    key={spd}
                    type="button"
                    onClick={() => {
                      soundFx.playSwitchClick();
                      setAnimSpeed(spd);
                    }}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono cursor-pointer ${
                      animSpeed === spd
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Row 2: Visualization Modes & Technical Overlays */}
          <div className="flex flex-nowrap md:flex-wrap items-center justify-between gap-1.5 pt-1.5 sm:pt-2 border-t border-slate-800/90 overflow-x-auto no-scrollbar">
            <div className="flex flex-nowrap md:flex-wrap items-center gap-1 sm:gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  soundFx.playSwitchClick();
                  setXrayMode((prev) => !prev);
                }}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-mono flex items-center gap-1.5 border transition-colors cursor-pointer ${
                  xrayMode
                    ? 'bg-[#C9A227] text-slate-950 border-amber-400 font-bold'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white hover:border-slate-700'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Raio-X
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFx.playSwitchClick();
                  setFluxVisible((prev) => !prev);
                }}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-mono flex items-center gap-1.5 border transition-colors cursor-pointer ${
                  fluxVisible
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 font-bold'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white hover:border-slate-700'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Campo Magnético
              </button>

              <button
                type="button"
                onClick={handleTriggerDielectric}
                disabled={dielectricPulse}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-mono flex items-center gap-1.5 border transition-colors cursor-pointer ${
                  dielectricPulse
                    ? 'bg-sky-400 text-slate-950 border-sky-300 font-bold'
                    : 'bg-slate-900 text-sky-300 border-slate-800 hover:bg-sky-950/50 hover:border-sky-700'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                Disparo Dielétrico
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFx.playSwitchClick();
                  setInspectionMode((prev) => !prev);
                }}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-mono flex items-center gap-1.5 border transition-colors cursor-pointer ${
                  inspectionMode
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/50 font-bold'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <Crosshair className="w-3.5 h-3.5" />
                Inspeção
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFx.playSwitchClick();
                  setLabelsVisible((prev) => !prev);
                }}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-mono flex items-center gap-1.5 border transition-colors cursor-pointer ${
                  labelsVisible
                    ? 'bg-slate-800 text-slate-100 border-slate-600 font-bold'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <Tag className="w-3.5 h-3.5" />
                Etiquetas
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  soundFx.playSwitchClick();
                  setAutoRotate((prev) => !prev);
                }}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-mono border transition-colors cursor-pointer ${
                  autoRotate
                    ? 'bg-slate-800 text-cyan-300 border-cyan-700 font-bold'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                Órbita Auto
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
