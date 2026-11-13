import * as THREE from 'three';
import { ProceduralTextureSet } from './proceduralTextures';
import { PartId } from '../../utils/transformerKinematics';

export interface TransformerMaterials {
  tankSteel: THREE.MeshPhysicalMaterial;
  tankCoverSteel: THREE.MeshPhysicalMaterial;
  weldSeamSteel: THREE.MeshStandardMaterial;
  radiatorFinSteel: THREE.MeshPhysicalMaterial;
  radiatorPipeSteel: THREE.MeshStandardMaterial;
  conservatorSteel: THREE.MeshPhysicalMaterial;
  galvanizedHardware: THREE.MeshStandardMaterial;
  darkStructuralSteel: THREE.MeshStandardMaterial;
  porcelainHV: THREE.MeshPhysicalMaterial;
  porcelainMV: THREE.MeshPhysicalMaterial;
  copperHV: THREE.MeshPhysicalMaterial;
  copperLV: THREE.MeshPhysicalMaterial;
  brassFitting: THREE.MeshStandardMaterial;
  siliconSteelCore: THREE.MeshPhysicalMaterial;
  pressboard: THREE.MeshStandardMaterial;
  kraftInsulation: THREE.MeshStandardMaterial;
  oilSightGlass: THREE.MeshPhysicalMaterial;
  silicaGelOrange: THREE.MeshStandardMaterial;
  kioskPanel: THREE.MeshStandardMaterial;
  kioskFace: THREE.MeshStandardMaterial;
  nameplate: THREE.MeshStandardMaterial;
  concretePad: THREE.MeshStandardMaterial;
  xrayTankShell: THREE.MeshPhysicalMaterial;
  xrayTankEdge: THREE.LineBasicMaterial;
  phaseMarkers: THREE.MeshStandardMaterial[];
  allInteractiveMaterials: Map<PartId, THREE.Material[]>;
  setPartHighlight: (activeId: PartId | null, hoverId: PartId | null) => void;
  setXrayMode: (enabled: boolean) => void;
  dispose: () => void;
}

export function createTransformerMaterials(
  textures: ProceduralTextureSet,
  isSoftwareGl: boolean
): TransformerMaterials {
  const tracked: THREE.Material[] = [];
  const reg = <T extends THREE.Material>(m: T): T => {
    tracked.push(m);
    return m;
  };

  // Industrial Blue-Grey Enamel Tank Steel (RAL 7031 / ABB-Siemens Industrial Tone)
  const tankSteel = reg(
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      map: textures.steelColor,
      bumpMap: textures.steelBump,
      bumpScale: 0.012,
      roughnessMap: textures.steelRoughness,
      roughness: 0.52,
      metalness: 0.45,
      clearcoat: 0.25,
      clearcoatRoughness: 0.42,
      envMapIntensity: 1.15,
    })
  );

  const tankCoverSteel = reg(tankSteel.clone());
  tankCoverSteel.color.setHex(0xeaf0f4);

  const weldSeamSteel = reg(
    new THREE.MeshStandardMaterial({
      color: 0x263138,
      bumpMap: textures.steelBump,
      bumpScale: 0.025,
      roughness: 0.68,
      metalness: 0.55,
    })
  );

  const radiatorFinSteel = reg(
    new THREE.MeshPhysicalMaterial({
      color: 0x455560,
      bumpMap: textures.steelBump,
      bumpScale: 0.008,
      roughness: 0.42,
      metalness: 0.55,
      clearcoat: 0.2,
      clearcoatRoughness: 0.35,
      envMapIntensity: 1.1,
    })
  );

  const radiatorPipeSteel = reg(
    new THREE.MeshStandardMaterial({
      color: 0x3b4952,
      roughness: 0.44,
      metalness: 0.6,
    })
  );

  const conservatorSteel = reg(tankSteel.clone());

  const galvanizedHardware = reg(
    new THREE.MeshStandardMaterial({
      color: 0xbac3ca,
      bumpMap: textures.brushedMetalBump,
      bumpScale: 0.006,
      roughness: 0.3,
      metalness: 0.88,
      envMapIntensity: 1.25,
    })
  );

  const darkStructuralSteel = reg(
    new THREE.MeshStandardMaterial({
      color: 0x1e262c,
      roughness: 0.58,
      metalness: 0.62,
    })
  );

  // High-gloss Brown/Terracotta Electrical Porcelain (IEC Glazed Ceramic)
  const porcelainHV = reg(
    new THREE.MeshPhysicalMaterial({
      color: 0x7b331d,
      roughness: 0.14,
      metalness: 0.04,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 0.9,
      envMapIntensity: 1.3,
    })
  );

  const porcelainMV = reg(
    new THREE.MeshPhysicalMaterial({
      color: 0x8a3a21,
      roughness: 0.16,
      metalness: 0.04,
      clearcoat: 0.95,
      clearcoatRoughness: 0.1,
      envMapIntensity: 1.25,
    })
  );

  // Electrolytic Copper Windings (Distinct HV vs LV warmth + physical turn bump)
  const copperHV = reg(
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      map: textures.copperColor,
      bumpMap: textures.copperBump,
      bumpScale: 0.022,
      roughnessMap: textures.copperRoughness,
      roughness: 0.32,
      metalness: 0.88,
      clearcoat: 0.35,
      clearcoatRoughness: 0.25,
      envMapIntensity: 1.35,
    })
  );

  const copperLV = reg(
    new THREE.MeshPhysicalMaterial({
      color: 0xffd7b8,
      map: textures.copperColor,
      bumpMap: textures.copperBump,
      bumpScale: 0.018,
      roughnessMap: textures.copperRoughness,
      roughness: 0.26,
      metalness: 0.92,
      clearcoat: 0.4,
      clearcoatRoughness: 0.2,
      envMapIntensity: 1.4,
    })
  );

  const brassFitting = reg(
    new THREE.MeshStandardMaterial({
      color: 0xc99c3c,
      bumpMap: textures.brushedMetalBump,
      bumpScale: 0.008,
      roughness: 0.28,
      metalness: 0.88,
      envMapIntensity: 1.3,
    })
  );

  // Grain-Oriented Silicon Steel Laminated Core
  const siliconSteelCore = reg(
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      map: textures.siliconColor,
      bumpMap: textures.siliconBump,
      bumpScale: 0.028,
      roughness: 0.36,
      metalness: 0.82,
      anisotropy: isSoftwareGl ? 0 : 0.75,
      anisotropyRotation: Math.PI / 2,
      envMapIntensity: 1.25,
    })
  );

  // Pressboard & Thermally Upgraded Kraft Insulation
  const pressboard = reg(
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: textures.pressboardColor,
      bumpMap: textures.pressboardBump,
      bumpScale: 0.015,
      roughness: 0.78,
      metalness: 0.02,
    })
  );

  const kraftInsulation = reg(
    new THREE.MeshStandardMaterial({
      color: 0xdfb980,
      map: textures.pressboardColor,
      bumpMap: textures.pressboardBump,
      bumpScale: 0.01,
      roughness: 0.84,
      metalness: 0.0,
    })
  );

  const oilSightGlass = reg(
    new THREE.MeshPhysicalMaterial({
      color: 0xd99b26,
      roughness: 0.1,
      metalness: 0.05,
      transparent: true,
      opacity: isSoftwareGl ? 0.55 : 0.85,
      transmission: isSoftwareGl ? 0 : 0.7,
      ior: 1.48,
      thickness: 0.2,
    })
  );

  const silicaGelOrange = reg(
    new THREE.MeshStandardMaterial({
      color: 0xe67e22,
      roughness: 0.35,
      metalness: 0.1,
      transparent: true,
      opacity: 0.85,
    })
  );

  const kioskPanel = reg(
    new THREE.MeshStandardMaterial({
      color: 0x37434c,
      roughness: 0.45,
      metalness: 0.45,
    })
  );

  const kioskFace = reg(
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: textures.kioskFaceColor,
      roughness: 0.35,
      metalness: 0.25,
    })
  );

  const nameplate = reg(
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: textures.nameplateColor,
      roughness: 0.32,
      metalness: 0.65,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    })
  );

  const concretePad = reg(
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: textures.concreteColor,
      bumpMap: textures.concreteBump,
      bumpScale: 0.025,
      roughness: 0.88,
      metalness: 0.04,
    })
  );

  // X-Ray Architectural Cutaway Material (clean translucent technical shell + structural edge lines)
  const xrayTankShell = reg(
    new THREE.MeshPhysicalMaterial({
      color: 0x0ea5e9,
      roughness: 0.2,
      metalness: 0.1,
      transparent: true,
      opacity: 0.14,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
  );

  const xrayTankEdge = reg(
    new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.78,
    })
  );

  const phaseMarkers = [0xdc2626, 0xf8fafc, 0x2563eb].map((c) =>
    reg(
      new THREE.MeshStandardMaterial({
        color: c,
        roughness: 0.35,
        metalness: 0.15,
      })
    )
  );

  const allInteractiveMaterials = new Map<PartId, THREE.Material[]>([
    ['tank', [tankSteel, weldSeamSteel]],
    ['tankCover', [tankCoverSteel]],
    ['bushingsHV', [porcelainHV]],
    ['bushingsMV', [porcelainMV]],
    ['radiators', [radiatorFinSteel, radiatorPipeSteel]],
    ['conservator', [conservatorSteel]],
    ['insulation', [pressboard, kraftInsulation]],
    ['windingsHV', [copperHV]],
    ['windingsLV', [copperLV]],
    ['core', [siliconSteelCore]],
    ['kiosk', [kioskPanel]],
  ]);

  const setPartHighlight = (activeId: PartId | null, hoverId: PartId | null) => {
    allInteractiveMaterials.forEach((mats, partId) => {
      const isSelected = activeId === partId;
      const isHovered = hoverId === partId;
      for (const m of mats) {
        if (m instanceof THREE.MeshStandardMaterial) {
          if (isSelected) {
            m.emissive.setHex(0xc9a227);
            m.emissiveIntensity = 0.28;
          } else if (isHovered) {
            m.emissive.setHex(0x38bdf8);
            m.emissiveIntensity = 0.18;
          } else {
            m.emissive.setHex(0x000000);
            m.emissiveIntensity = 0;
          }
        }
      }
    });
  };

  const setXrayMode = (enabled: boolean) => {
    tankSteel.transparent = enabled;
    tankSteel.opacity = enabled ? 0.10 : 1.0;
    tankSteel.depthWrite = !enabled;
    tankSteel.needsUpdate = true;

    tankCoverSteel.transparent = enabled;
    tankCoverSteel.opacity = enabled ? 0.12 : 1.0;
    tankCoverSteel.depthWrite = !enabled;
    tankCoverSteel.needsUpdate = true;

    weldSeamSteel.transparent = enabled;
    weldSeamSteel.opacity = enabled ? 0.12 : 1.0;
    weldSeamSteel.depthWrite = !enabled;
    weldSeamSteel.needsUpdate = true;

    radiatorFinSteel.transparent = enabled;
    radiatorFinSteel.opacity = enabled ? 0.18 : 1.0;
    radiatorFinSteel.depthWrite = !enabled;
    radiatorFinSteel.needsUpdate = true;
  };

  return {
    tankSteel,
    tankCoverSteel,
    weldSeamSteel,
    radiatorFinSteel,
    radiatorPipeSteel,
    conservatorSteel,
    galvanizedHardware,
    darkStructuralSteel,
    porcelainHV,
    porcelainMV,
    copperHV,
    copperLV,
    brassFitting,
    siliconSteelCore,
    pressboard,
    kraftInsulation,
    oilSightGlass,
    silicaGelOrange,
    kioskPanel,
    kioskFace,
    nameplate,
    concretePad,
    xrayTankShell,
    xrayTankEdge,
    phaseMarkers,
    allInteractiveMaterials,
    setPartHighlight,
    setXrayMode,
    dispose: () => {
      tracked.forEach((m) => m.dispose());
    },
  };
}
