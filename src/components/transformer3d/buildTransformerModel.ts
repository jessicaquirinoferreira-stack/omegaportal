import * as THREE from 'three';
import { TransformerMaterials } from './materialsLibrary';
import { ProceduralTextureSet } from './proceduralTextures';
import { PartId } from '../../utils/transformerKinematics';

export interface TransformerAssembly {
  root: THREE.Group;
  groups: {
    bushingsHV: THREE.Group;
    bushingsMV: THREE.Group;
    conservator: THREE.Group;
    radiatorsLeft: THREE.Group;
    radiatorsRight: THREE.Group;
    kiosk: THREE.Group;
    tankCover: THREE.Group;
    tankBody: THREE.Group;
    insulation: THREE.Group;
    windingsHV: THREE.Group;
    windingsLV: THREE.Group;
    core: THREE.Group;
  };
  xrayHelpers: THREE.Object3D[];
  interactables: THREE.Object3D[];
  calloutAnchors: Record<PartId, THREE.Object3D>;
  hvArcPoints: THREE.Vector3[];
  dispose: () => void;
}

function tagInteractive(obj: THREE.Object3D, partId: PartId, interactables: THREE.Object3D[]) {
  obj.traverse((child) => {
    child.userData.partId = partId;
    if ((child as THREE.Mesh).isMesh) {
      interactables.push(child);
    }
  });
}

function createAnchor(name: string, x: number, y: number, z: number, parent: THREE.Object3D): THREE.Object3D {
  const anchor = new THREE.Object3D();
  anchor.name = name;
  anchor.position.set(x, y, z);
  parent.add(anchor);
  return anchor;
}

export function buildTransformerModel(
  mats: TransformerMaterials,
  textures: ProceduralTextureSet,
  isSoftwareGl: boolean
): TransformerAssembly {
  const geometriesToDispose: THREE.BufferGeometry[] = [];
  const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
    geometriesToDispose.push(g);
    return g;
  };

  const root = new THREE.Group();
  const interactables: THREE.Object3D[] = [];
  const xrayHelpers: THREE.Object3D[] = [];

  // ============================================================================
  // 0. SUBSTATION CONCRETE PAD, OIL CONTAINMENT BASIN & SKID RAILS (GROUND y=0)
  // ============================================================================
  const plinthGroup = new THREE.Group();
  const padGeo = trackGeo(new THREE.BoxGeometry(7.2, 0.28, 5.4));
  const padMesh = new THREE.Mesh(padGeo, mats.concretePad);
  padMesh.position.y = -0.14;
  padMesh.receiveShadow = true;
  plinthGroup.add(padMesh);

  // Containment basin lip around transformer footprint
  const curbMat = mats.concretePad;
  const curbGeoLong = trackGeo(new THREE.BoxGeometry(3.6, 0.14, 0.14));
  const curbGeoShort = trackGeo(new THREE.BoxGeometry(0.14, 0.14, 2.7));
  [-1.35, 1.35].forEach((z) => {
    const c = new THREE.Mesh(curbGeoLong, curbMat);
    c.position.set(0, 0.05, z);
    c.receiveShadow = true;
    plinthGroup.add(c);
  });
  [-1.73, 1.73].forEach((x) => {
    const c = new THREE.Mesh(curbGeoShort, curbMat);
    c.position.set(x, 0.05, 0);
    c.receiveShadow = true;
    plinthGroup.add(c);
  });

  // Heavy steel skid rails under tank
  const railGeo = trackGeo(new THREE.BoxGeometry(2.85, 0.12, 0.14));
  [-0.68, 0.68].forEach((z) => {
    const rail = new THREE.Mesh(railGeo, mats.darkStructuralSteel);
    rail.position.set(0, 0.06, z);
    rail.castShadow = true;
    rail.receiveShadow = true;
    plinthGroup.add(rail);
  });

  // Grounding contact shadow disc
  const shadowGeo = trackGeo(new THREE.PlaneGeometry(8.5, 6.8));
  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x000000,
    alphaMap: textures.contactShadowAlpha,
    transparent: true,
    opacity: 0.58,
    depthWrite: false,
  });
  const shadowDisc = new THREE.Mesh(shadowGeo, shadowMat);
  shadowDisc.rotation.x = -Math.PI / 2;
  shadowDisc.position.y = 0.012;
  plinthGroup.add(shadowDisc);
  root.add(plinthGroup);

  // ============================================================================
  // 1. LAMINATED 3-LIMB MAGNETIC CORE (coreGroup) - Silicon Steel GO
  // ============================================================================
  const coreGroup = new THREE.Group();
  const limbXPositions = [-0.78, 0, 0.78];

  // Stepped cruciform core limb (multi-packet geometry + instanced visible laminations)
  const packetSteps = [
    { w: 0.34, d: 0.18 },
    { w: 0.28, d: 0.26 },
    { w: 0.20, d: 0.33 },
  ];

  limbXPositions.forEach((lx) => {
    packetSteps.forEach((step) => {
      const geo = trackGeo(new THREE.BoxGeometry(step.w, 1.44, step.d));
      const mesh = new THREE.Mesh(geo, mats.siliconSteelCore);
      mesh.position.set(lx, 1.12, 0);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      coreGroup.add(mesh);
    });
  });

  // Top & Bottom Yokes (Stepped + mitered visual ends)
  [0.34, 1.88].forEach((yy) => {
    packetSteps.forEach((step) => {
      const yokeGeo = trackGeo(new THREE.BoxGeometry(1.94, step.w * 0.85, step.d));
      const yoke = new THREE.Mesh(yokeGeo, mats.siliconSteelCore);
      yoke.position.set(0, yy, 0);
      yoke.castShadow = true;
      yoke.receiveShadow = true;
      coreGroup.add(yoke);
    });
  });

  // Instanced individual visible silicon-steel lamination sheets on limbs & yokes
  // so close-up zoom distinctly shows stacked sheets rather than a solid block!
  const sheetCountPerLimb = 14;
  const totalSheets = limbXPositions.length * sheetCountPerLimb;
  const sheetGeo = trackGeo(new THREE.BoxGeometry(0.355, 1.72, 0.009));
  const sheetInst = new THREE.InstancedMesh(sheetGeo, mats.siliconSteelCore, totalSheets);
  const dummy = new THREE.Object3D();
  let sIdx = 0;
  limbXPositions.forEach((lx) => {
    for (let i = 0; i < sheetCountPerLimb; i++) {
      const zOff = -0.13 + (i / (sheetCountPerLimb - 1)) * 0.26;
      const wScale = 1 - Math.abs(zOff) * 1.15;
      dummy.position.set(lx, 1.11, zOff);
      dummy.scale.set(Math.max(0.62, wScale), 1, 1);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      sheetInst.setMatrixAt(sIdx++, dummy.matrix);
    }
  });
  sheetInst.instanceMatrix.needsUpdate = true;
  sheetInst.computeBoundingSphere();
  coreGroup.add(sheetInst);

  // Heavy Core Clamping Beams (Vigas de Prensagem) & Tie Rods
  const clampBeamGeo = trackGeo(new THREE.BoxGeometry(2.12, 0.11, 0.08));
  [0.34, 1.88].forEach((yy) => {
    [-0.19, 0.19].forEach((zz) => {
      const beam = new THREE.Mesh(clampBeamGeo, mats.darkStructuralSteel);
      beam.position.set(0, yy, zz);
      beam.castShadow = true;
      coreGroup.add(beam);
    });
  });

  const tieRodGeo = trackGeo(new THREE.CylinderGeometry(0.018, 0.018, 1.66, 10));
  [-0.98, -0.39, 0.39, 0.98].forEach((tx) => {
    [-0.19, 0.19].forEach((tz) => {
      const rod = new THREE.Mesh(tieRodGeo, mats.galvanizedHardware);
      rod.position.set(tx, 1.11, tz);
      coreGroup.add(rod);
    });
  });

  // Core bottom foot supports & copper grounding strap
  const footGeo = trackGeo(new THREE.BoxGeometry(0.24, 0.08, 0.44));
  [-0.85, 0.85].forEach((fx) => {
    const foot = new THREE.Mesh(footGeo, mats.darkStructuralSteel);
    foot.position.set(fx, 0.18, 0);
    coreGroup.add(foot);
  });
  const coreGroundGeo = trackGeo(new THREE.BoxGeometry(0.04, 0.22, 0.015));
  const coreGround = new THREE.Mesh(coreGroundGeo, mats.copperLV);
  coreGround.position.set(0.95, 1.88, 0.22);
  coreGroup.add(coreGround);

  tagInteractive(coreGroup, 'core', interactables);
  root.add(coreGroup);

  // ============================================================================
  // 2. SECONDARY / LV HELICAL COPPER WINDINGS (windingsLVGroup)
  // ============================================================================
  const windingsLVGroup = new THREE.Group();
  const lvRingGeo = trackGeo(new THREE.CylinderGeometry(0.245, 0.245, 0.068, 28, 1, false));
  const lvRingsCount = 15;
  const lvInst = new THREE.InstancedMesh(lvRingGeo, mats.copperLV, limbXPositions.length * lvRingsCount);
  let lvIdx = 0;
  limbXPositions.forEach((lx) => {
    for (let i = 0; i < lvRingsCount; i++) {
      const yPos = 0.56 + i * 0.076;
      dummy.position.set(lx, yPos, 0);
      dummy.scale.set(1, 1, 1);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      lvInst.setMatrixAt(lvIdx++, dummy.matrix);
    }
    // Axial LV vertical lead risers
    const leadGeo = trackGeo(new THREE.BoxGeometry(0.032, 0.52, 0.022));
    const lead = new THREE.Mesh(leadGeo, mats.copperLV);
    lead.position.set(lx + 0.06, 1.82, -0.23);
    windingsLVGroup.add(lead);
  });
  lvInst.instanceMatrix.needsUpdate = true;
  lvInst.computeBoundingSphere();
  lvInst.castShadow = true;
  windingsLVGroup.add(lvInst);

  tagInteractive(windingsLVGroup, 'windingsLV', interactables);
  root.add(windingsLVGroup);

  // ============================================================================
  // 3. PRIMARY / HV MULTI-DISC COPPER WINDINGS (windingsHVGroup)
  // ============================================================================
  const windingsHVGroup = new THREE.Group();
  // Hollow disc rings built with LatheGeometry for real wall thickness & chamfered inner/outer bevels!
  const discProfile = [
    new THREE.Vector2(0.285, -0.022),
    new THREE.Vector2(0.352, -0.022),
    new THREE.Vector2(0.358, -0.015),
    new THREE.Vector2(0.358, 0.015),
    new THREE.Vector2(0.352, 0.022),
    new THREE.Vector2(0.285, 0.022),
    new THREE.Vector2(0.280, 0.015),
    new THREE.Vector2(0.280, -0.015),
    new THREE.Vector2(0.285, -0.022),
  ];
  const hvDiscGeo = trackGeo(new THREE.LatheGeometry(discProfile, 32));
  const hvDiscsPerLimb = 18;
  const hvInst = new THREE.InstancedMesh(hvDiscGeo, mats.copperHV, limbXPositions.length * hvDiscsPerLimb);
  let hvIdx = 0;
  limbXPositions.forEach((lx) => {
    for (let i = 0; i < hvDiscsPerLimb; i++) {
      const yPos = 0.55 + i * 0.064;
      dummy.position.set(lx, yPos, 0);
      dummy.scale.set(1, 1, 1);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      hvInst.setMatrixAt(hvIdx++, dummy.matrix);
    }

    // Top & bottom electrostatic stress-control rings
    const ringGeo = trackGeo(new THREE.TorusGeometry(0.32, 0.024, 12, 28));
    [0.48, 1.70].forEach((ry) => {
      const ring = new THREE.Mesh(ringGeo, mats.copperHV);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(lx, ry, 0);
      windingsHVGroup.add(ring);
    });

    // HV vertical riser lead toward HV bushings (front +Z side)
    const riserCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(lx, 1.66, 0.34),
      new THREE.Vector3(lx, 1.92, 0.42),
      new THREE.Vector3(lx, 2.20, 0.44),
    ]);
    const riserGeo = trackGeo(new THREE.TubeGeometry(riserCurve, 12, 0.016, 8, false));
    const riser = new THREE.Mesh(riserGeo, mats.copperHV);
    windingsHVGroup.add(riser);
  });
  hvInst.instanceMatrix.needsUpdate = true;
  hvInst.computeBoundingSphere();
  hvInst.castShadow = true;
  windingsHVGroup.add(hvInst);

  tagInteractive(windingsHVGroup, 'windingsHV', interactables);
  root.add(windingsHVGroup);

  // ============================================================================
  // 4. INTERNAL DIELECTRIC INSULATION SYSTEM (insulationGroup)
  // ============================================================================
  const insulationGroup = new THREE.Group();

  // Concentric pressboard cylinders between LV and HV + outer barrier
  const barrierCylGeo = trackGeo(new THREE.CylinderGeometry(0.268, 0.268, 1.24, 28, 1, true));
  const outerBarrierGeo = trackGeo(new THREE.CylinderGeometry(0.372, 0.372, 1.26, 28, 1, true));
  const pressboardDoubleMat = mats.pressboard.clone();
  pressboardDoubleMat.side = THREE.DoubleSide;

  limbXPositions.forEach((lx) => {
    const innerCyl = new THREE.Mesh(barrierCylGeo, pressboardDoubleMat);
    innerCyl.position.set(lx, 1.09, 0);
    insulationGroup.add(innerCyl);

    // Top & Bottom Pressboard End Clamping Rings
    const clampRingGeo = trackGeo(new THREE.RingGeometry(0.22, 0.38, 28));
    [0.455, 1.73].forEach((ry) => {
      const cr = new THREE.Mesh(clampRingGeo, pressboardDoubleMat);
      cr.rotation.x = -Math.PI / 2;
      cr.position.set(lx, ry, 0);
      insulationGroup.add(cr);
    });
  });

  // Phase-to-Phase vertical pressboard barriers between U-V and V-W
  const phaseBarrierGeo = trackGeo(new THREE.BoxGeometry(0.018, 1.38, 0.82));
  [-0.39, 0.39].forEach((bx) => {
    const pb = new THREE.Mesh(phaseBarrierGeo, mats.pressboard);
    pb.position.set(bx, 1.11, 0);
    insulationGroup.add(pb);
  });

  // Radial key spacers (InstancedMesh) creating visible oil cooling channels around HV discs
  const spacerGeo = trackGeo(new THREE.BoxGeometry(0.024, 1.18, 0.022));
  const spacersPerLimb = 10;
  const spacerInst = new THREE.InstancedMesh(spacerGeo, mats.kraftInsulation, limbXPositions.length * spacersPerLimb);
  let spIdx = 0;
  limbXPositions.forEach((lx) => {
    for (let i = 0; i < spacersPerLimb; i++) {
      const ang = (i / spacersPerLimb) * Math.PI * 2;
      const rad = 0.362;
      dummy.position.set(lx + Math.cos(ang) * rad, 1.09, Math.sin(ang) * rad);
      dummy.rotation.set(0, -ang, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      spacerInst.setMatrixAt(spIdx++, dummy.matrix);
    }
  });
  spacerInst.instanceMatrix.needsUpdate = true;
  spacerInst.computeBoundingSphere();
  insulationGroup.add(spacerInst);

  // Outer pressboard wrap sleeve (partial arc so copper discs remain visible!)
  const partialWrapGeo = trackGeo(
    new THREE.CylinderGeometry(0.376, 0.376, 1.12, 24, 1, true, Math.PI * 0.25, Math.PI * 1.15)
  );
  limbXPositions.forEach((lx) => {
    const wrap = new THREE.Mesh(partialWrapGeo, pressboardDoubleMat);
    wrap.position.set(lx, 1.09, 0);
    insulationGroup.add(wrap);
  });

  // DETC / Tap-changer insulated drive shaft & selector bar
  const tapShaftGeo = trackGeo(new THREE.CylinderGeometry(0.025, 0.025, 1.45, 12));
  const tapShaft = new THREE.Mesh(tapShaftGeo, mats.kraftInsulation);
  tapShaft.position.set(1.06, 1.25, -0.35);
  insulationGroup.add(tapShaft);

  // Keep reference to outerBarrierGeo unused warning clean
  outerBarrierGeo.dispose();

  tagInteractive(insulationGroup, 'insulation', interactables);
  root.add(insulationGroup);

  // ============================================================================
  // 5. MAIN INDUSTRIAL STEEL TANK BODY (tankBodyGroup)
  // ============================================================================
  const tankBodyGroup = new THREE.Group();

  // Build real hollow tank enclosure (wall perimeter + bottom plate) using ExtrudeGeometry
  const outerW = 2.66;
  const outerD = 1.66;
  const wallT = 0.055;
  const rCorner = 0.09;

  const tankShape = new THREE.Shape();
  const hw = outerW / 2;
  const hd = outerD / 2;
  tankShape.moveTo(-hw + rCorner, -hd);
  tankShape.lineTo(hw - rCorner, -hd);
  tankShape.quadraticCurveTo(hw, -hd, hw, -hd + rCorner);
  tankShape.lineTo(hw, hd - rCorner);
  tankShape.quadraticCurveTo(hw, hd, hw - rCorner, hd);
  tankShape.lineTo(-hw + rCorner, hd);
  tankShape.quadraticCurveTo(-hw, hd, -hw, hd - rCorner);
  tankShape.lineTo(-hw, -hd + rCorner);
  tankShape.quadraticCurveTo(-hw, -hd, -hw + rCorner, -hd);

  const innerHole = new THREE.Path();
  const ihw = hw - wallT;
  const ihd = hd - wallT;
  innerHole.moveTo(-ihw, -ihd);
  innerHole.lineTo(-ihw, ihd);
  innerHole.lineTo(ihw, ihd);
  innerHole.lineTo(ihw, -ihd);
  innerHole.lineTo(-ihw, -ihd);
  tankShape.holes.push(innerHole);

  const tankWallGeo = trackGeo(
    new THREE.ExtrudeGeometry(tankShape, {
      depth: 2.04,
      bevelEnabled: true,
      bevelThickness: 0.015,
      bevelSize: 0.015,
      bevelSegments: 2,
      curveSegments: 8,
    })
  );
  tankWallGeo.rotateX(-Math.PI / 2);
  const tankWallMesh = new THREE.Mesh(tankWallGeo, mats.tankSteel);
  tankWallMesh.position.y = 0.13;
  tankWallMesh.castShadow = true;
  tankWallMesh.receiveShadow = true;
  tankBodyGroup.add(tankWallMesh);

  // Tank bottom base plate
  const tankBaseGeo = trackGeo(new THREE.BoxGeometry(outerW + 0.08, 0.05, outerD + 0.08));
  const tankBaseMesh = new THREE.Mesh(tankBaseGeo, mats.darkStructuralSteel);
  tankBaseMesh.position.y = 0.135;
  tankBaseMesh.castShadow = true;
  tankBaseMesh.receiveShadow = true;
  tankBodyGroup.add(tankBaseMesh);

  // X-Ray structural edge wireframe for tank
  const tankXrayEdges = new THREE.LineSegments(
    trackGeo(new THREE.EdgesGeometry(tankWallGeo, 25)),
    mats.xrayTankEdge
  );
  tankXrayEdges.position.copy(tankWallMesh.position);
  tankXrayEdges.visible = false;
  xrayHelpers.push(tankXrayEdges);
  tankBodyGroup.add(tankXrayEdges);

  // Top Tank Rim Flange (for cover bolts)
  const flangeShape = new THREE.Shape();
  const fhw = hw + 0.075;
  const fhd = hd + 0.075;
  flangeShape.moveTo(-fhw, -fhd);
  flangeShape.lineTo(fhw, -fhd);
  flangeShape.lineTo(fhw, fhd);
  flangeShape.lineTo(-fhw, fhd);
  flangeShape.closePath();
  flangeShape.holes.push(innerHole);

  const topFlangeGeo = trackGeo(
    new THREE.ExtrudeGeometry(flangeShape, { depth: 0.036, bevelEnabled: false })
  );
  topFlangeGeo.rotateX(-Math.PI / 2);
  const topFlange = new THREE.Mesh(topFlangeGeo, mats.tankSteel);
  topFlange.position.y = 2.155;
  tankBodyGroup.add(topFlange);

  // Vertical & Horizontal Structural Tank Stiffener Ribs (Nervuras de Reforço) + Weld Seams
  const vRibGeo = trackGeo(new THREE.BoxGeometry(0.065, 1.88, 0.085));
  [-1.02, -0.51, 0, 0.51, 1.02].forEach((rx) => {
    [-hd - 0.035, hd + 0.035].forEach((rz) => {
      // Skip center front where kiosk mounts
      if (rz > 0 && Math.abs(rx) < 0.3) return;
      const rib = new THREE.Mesh(vRibGeo, mats.tankSteel);
      rib.position.set(rx, 1.14, rz);
      rib.castShadow = true;
      tankBodyGroup.add(rib);

      // Weld seam strip alongside rib
      const weldGeo = trackGeo(new THREE.BoxGeometry(0.015, 1.86, 0.018));
      const weld = new THREE.Mesh(weldGeo, mats.weldSeamSteel);
      weld.position.set(rx + 0.036, 1.14, rz - Math.sign(rz) * 0.025);
      tankBodyGroup.add(weld);
    });
  });

  // Horizontal mid-belt reinforcement channel
  const hBeltGeo = trackGeo(new THREE.BoxGeometry(outerW + 0.12, 0.075, outerD + 0.12));
  [0.42, 1.98].forEach((by) => {
    const belt = new THREE.Mesh(hBeltGeo, mats.weldSeamSteel);
    belt.position.y = by;
    tankBodyGroup.add(belt);
  });

  // 4 Heavy Lifting Lugs (Olhais de Içamento) & 4 Jacking Pads
  const lugGeo = trackGeo(new THREE.BoxGeometry(0.11, 0.24, 0.16));
  const lugHoleGeo = trackGeo(new THREE.TorusGeometry(0.042, 0.018, 8, 16));
  [-1.22, 1.22].forEach((lx) => {
    [-0.76, 0.76].forEach((lz) => {
      const lug = new THREE.Mesh(lugGeo, mats.darkStructuralSteel);
      lug.position.set(lx + Math.sign(lx) * 0.12, 1.96, lz);
      tankBodyGroup.add(lug);

      const eye = new THREE.Mesh(lugHoleGeo, mats.galvanizedHardware);
      eye.rotation.y = Math.PI / 2;
      eye.position.set(lx + Math.sign(lx) * 0.16, 2.02, lz);
      tankBodyGroup.add(eye);
    });
  });

  // Inspection Manhole Hatches (Tampas de Inspeção) on front-left & rear
  const hatchRingGeo = trackGeo(new THREE.CylinderGeometry(0.19, 0.2, 0.055, 20));
  const hatchPlateGeo = trackGeo(new THREE.CylinderGeometry(0.21, 0.21, 0.024, 20));
  [
    { x: -0.76, y: 1.52, z: hd + 0.02 },
    { x: 0.76, y: 1.52, z: -hd - 0.02 },
  ].forEach((h) => {
    const hNeck = new THREE.Mesh(hatchRingGeo, mats.weldSeamSteel);
    hNeck.rotation.x = Math.PI / 2;
    hNeck.position.set(h.x, h.y, h.z);
    tankBodyGroup.add(hNeck);

    const hCover = new THREE.Mesh(hatchPlateGeo, mats.galvanizedHardware);
    hCover.rotation.x = Math.PI / 2;
    hCover.position.set(h.x, h.y, h.z + Math.sign(h.z) * 0.032);
    tankBodyGroup.add(hCover);
  });

  // Drain & Filter Gate Valves + Copper Grounding Pads
  const valvePipeGeo = trackGeo(new THREE.CylinderGeometry(0.045, 0.045, 0.18, 14));
  const valveWheelGeo = trackGeo(new THREE.TorusGeometry(0.085, 0.014, 8, 18));
  [-0.95, 0.95].forEach((vx) => {
    const vp = new THREE.Mesh(valvePipeGeo, mats.brassFitting);
    vp.rotation.x = Math.PI / 2;
    vp.position.set(vx, 0.32, hd + 0.08);
    tankBodyGroup.add(vp);

    const vw = new THREE.Mesh(valveWheelGeo, mats.brassFitting);
    vw.position.set(vx, 0.32, hd + 0.18);
    tankBodyGroup.add(vw);
  });

  // Official Engraved Omega Nameplate on Front Right Tank Wall
  const npPlateGeo = trackGeo(new THREE.BoxGeometry(0.56, 0.35, 0.016));
  const npMesh = new THREE.Mesh(npPlateGeo, mats.nameplate);
  npMesh.position.set(0.76, 1.48, hd + 0.025);
  tankBodyGroup.add(npMesh);

  // Copper Earthing Pads at base corners
  const gndPadGeo = trackGeo(new THREE.BoxGeometry(0.11, 0.08, 0.025));
  [-1.18, 1.18].forEach((gx) => {
    const gp = new THREE.Mesh(gndPadGeo, mats.copperHV);
    gp.position.set(gx, 0.22, hd + 0.03);
    tankBodyGroup.add(gp);
  });

  tagInteractive(tankBodyGroup, 'tank', interactables);
  root.add(tankBodyGroup);

  // ============================================================================
  // 6. TANK TOP COVER & TURRETS (tankCoverGroup)
  // ============================================================================
  const tankCoverGroup = new THREE.Group();

  const coverGeo = trackGeo(new THREE.BoxGeometry(outerW + 0.16, 0.068, outerD + 0.16));
  const coverMesh = new THREE.Mesh(coverGeo, mats.tankCoverSteel);
  coverMesh.position.y = 2.225;
  coverMesh.castShadow = true;
  coverMesh.receiveShadow = true;
  tankCoverGroup.add(coverMesh);

  const coverXrayEdges = new THREE.LineSegments(
    trackGeo(new THREE.EdgesGeometry(coverGeo, 20)),
    mats.xrayTankEdge
  );
  coverXrayEdges.position.copy(coverMesh.position);
  coverXrayEdges.visible = false;
  xrayHelpers.push(coverXrayEdges);
  tankCoverGroup.add(coverXrayEdges);

  // Instanced Perimeter Hex Bolts around Tank Cover Flange (48 bolts!)
  const boltGeo = trackGeo(new THREE.CylinderGeometry(0.022, 0.022, 0.045, 6));
  const boltPositions: [number, number][] = [];
  for (let x = -1.32; x <= 1.321; x += 0.22) {
    boltPositions.push([x, -0.84], [x, 0.84]);
  }
  for (let z = -0.66; z <= 0.661; z += 0.22) {
    boltPositions.push([-1.34, z], [1.34, z]);
  }
  const boltInst = new THREE.InstancedMesh(boltGeo, mats.galvanizedHardware, boltPositions.length);
  boltPositions.forEach(([bx, bz], i) => {
    dummy.position.set(bx, 2.275, bz);
    dummy.scale.set(1, 1, 1);
    dummy.rotation.set(0, 0, 0);
    dummy.updateMatrix();
    boltInst.setMatrixAt(i, dummy.matrix);
  });
  boltInst.instanceMatrix.needsUpdate = true;
  boltInst.computeBoundingSphere();
  tankCoverGroup.add(boltInst);

  // HV Bushing Mounting Turrets (with CT collar & bolted flange)
  const turretBaseGeo = trackGeo(new THREE.CylinderGeometry(0.175, 0.215, 0.34, 24));
  const turretFlangeGeo = trackGeo(new THREE.CylinderGeometry(0.225, 0.225, 0.032, 24));
  limbXPositions.forEach((bx) => {
    const turret = new THREE.Mesh(turretBaseGeo, mats.tankCoverSteel);
    turret.position.set(bx, 2.41, 0.44);
    turret.castShadow = true;
    tankCoverGroup.add(turret);

    const tFlange = new THREE.Mesh(turretFlangeGeo, mats.galvanizedHardware);
    tFlange.position.set(bx, 2.58, 0.44);
    tankCoverGroup.add(tFlange);
  });

  // Pressure Relief Valve (Válvula de Alívio de Pressão) on cover
  const prvBaseGeo = trackGeo(new THREE.CylinderGeometry(0.085, 0.1, 0.16, 16));
  const prvMesh = new THREE.Mesh(prvBaseGeo, mats.brassFitting);
  prvMesh.position.set(1.06, 2.34, -0.45);
  tankCoverGroup.add(prvMesh);

  const prvCapGeo = trackGeo(new THREE.CylinderGeometry(0.11, 0.11, 0.035, 16));
  const prvCap = new THREE.Mesh(prvCapGeo, mats.galvanizedHardware);
  prvCap.position.set(1.06, 2.43, -0.45);
  tankCoverGroup.add(prvCap);

  tagInteractive(tankCoverGroup, 'tankCover', interactables);
  root.add(tankCoverGroup);

  // ============================================================================
  // 7. HIGH VOLTAGE 500 kV CONDENSIVE BUSHINGS (bushingsHVGroup)
  // ============================================================================
  const bushingsHVGroup = new THREE.Group();

  // Lathe profile for authentic high-voltage alternating weather-shed porcelain column
  const hvProfile: THREE.Vector2[] = [new THREE.Vector2(0.01, 0)];
  hvProfile.push(new THREE.Vector2(0.16, 0));
  hvProfile.push(new THREE.Vector2(0.16, 0.08));
  const shedCount = 13;
  for (let i = 0; i < shedCount; i++) {
    const yBase = 0.10 + i * 0.108;
    const taper = 1 - (i / shedCount) * 0.24;
    const isLarge = i % 2 === 0;
    const coreR = 0.105 * taper;
    const outerR = (isLarge ? 0.195 : 0.155) * taper;
    hvProfile.push(new THREE.Vector2(coreR, yBase));
    hvProfile.push(new THREE.Vector2(outerR, yBase + 0.022));
    hvProfile.push(new THREE.Vector2(outerR, yBase + 0.040));
    hvProfile.push(new THREE.Vector2(coreR, yBase + 0.068));
  }
  hvProfile.push(new THREE.Vector2(0.085, 1.54));
  hvProfile.push(new THREE.Vector2(0.01, 1.54));

  const hvPorcelainGeo = trackGeo(new THREE.LatheGeometry(hvProfile, 28));
  const hvFlangeGeo = trackGeo(new THREE.CylinderGeometry(0.19, 0.19, 0.04, 24));
  const hvDomeGeo = trackGeo(new THREE.SphereGeometry(0.105, 20, 14));
  const hvStemGeo = trackGeo(new THREE.CylinderGeometry(0.028, 0.032, 0.28, 14));
  const hvPaddleGeo = trackGeo(new THREE.BoxGeometry(0.09, 0.12, 0.022));
  const phaseTagGeo = trackGeo(new THREE.CylinderGeometry(0.13, 0.13, 0.045, 20));
  const hornCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.13, 0.04, 0),
    new THREE.Vector3(0.19, 0.18, 0),
  ]);
  const hornGeo = trackGeo(new THREE.TubeGeometry(hornCurve, 10, 0.012, 8, false));

  const hvArcPoints: THREE.Vector3[] = [];

  limbXPositions.forEach((bx, idx) => {
    const bUnit = new THREE.Group();
    bUnit.position.set(bx, 2.60, 0.44);

    const bFlange = new THREE.Mesh(hvFlangeGeo, mats.galvanizedHardware);
    bFlange.position.y = 0.02;
    bUnit.add(bFlange);

    const porcelain = new THREE.Mesh(hvPorcelainGeo, mats.porcelainHV);
    porcelain.position.y = 0.04;
    porcelain.castShadow = true;
    bUnit.add(porcelain);

    // Phase collar ring (Red / White / Blue)
    const tagMesh = new THREE.Mesh(phaseTagGeo, mats.phaseMarkers[idx]);
    tagMesh.position.y = 0.09;
    bUnit.add(tagMesh);

    // Metallic oil expansion head + corona grading dome
    const dome = new THREE.Mesh(hvDomeGeo, mats.galvanizedHardware);
    dome.position.y = 1.60;
    dome.scale.set(1, 0.78, 1);
    bUnit.add(dome);

    // Copper terminal stem & NEMA 4-hole paddle
    const stem = new THREE.Mesh(hvStemGeo, mats.copperHV);
    stem.position.y = 1.78;
    bUnit.add(stem);

    const paddle = new THREE.Mesh(hvPaddleGeo, mats.copperHV);
    paddle.position.y = 1.94;
    bUnit.add(paddle);

    // Upper & Lower Arcing Horns (Centelhadores)
    const topHorn = new THREE.Mesh(hornGeo, mats.galvanizedHardware);
    topHorn.position.set(0.05, 1.62, 0);
    bUnit.add(topHorn);

    // Record local coordinates of terminal tip for Dielectric Discharge simulation
    hvArcPoints.push(new THREE.Vector3(bx, 2.60 + 1.94, 0.44));

    bushingsHVGroup.add(bUnit);
  });

  tagInteractive(bushingsHVGroup, 'bushingsHV', interactables);
  root.add(bushingsHVGroup);

  // ============================================================================
  // 8. MEDIUM / LOW VOLTAGE BUSHINGS (bushingsMVGroup)
  // ============================================================================
  const bushingsMVGroup = new THREE.Group();

  const mvProfile: THREE.Vector2[] = [new THREE.Vector2(0.01, 0), new THREE.Vector2(0.085, 0)];
  for (let i = 0; i < 6; i++) {
    const yb = 0.05 + i * 0.095;
    const taper = 1 - (i / 6) * 0.18;
    mvProfile.push(new THREE.Vector2(0.058 * taper, yb));
    mvProfile.push(new THREE.Vector2(0.102 * taper, yb + 0.022));
    mvProfile.push(new THREE.Vector2(0.102 * taper, yb + 0.036));
    mvProfile.push(new THREE.Vector2(0.058 * taper, yb + 0.062));
  }
  mvProfile.push(new THREE.Vector2(0.05, 0.68));
  mvProfile.push(new THREE.Vector2(0.01, 0.68));

  const mvPorcelainGeo = trackGeo(new THREE.LatheGeometry(mvProfile, 22));
  const mvFlangeGeo = trackGeo(new THREE.CylinderGeometry(0.11, 0.11, 0.03, 18));
  const mvStudGeo = trackGeo(new THREE.CylinderGeometry(0.018, 0.018, 0.18, 12));
  const mvFlagGeo = trackGeo(new THREE.BoxGeometry(0.055, 0.075, 0.018));

  [-0.86, -0.29, 0.29, 0.86].forEach((mx) => {
    const mUnit = new THREE.Group();
    mUnit.position.set(mx, 2.26, -0.52);

    const mf = new THREE.Mesh(mvFlangeGeo, mats.galvanizedHardware);
    mf.position.y = 0.015;
    mUnit.add(mf);

    const mp = new THREE.Mesh(mvPorcelainGeo, mats.porcelainMV);
    mp.position.y = 0.03;
    mp.castShadow = true;
    mUnit.add(mp);

    const stud = new THREE.Mesh(mvStudGeo, mats.brassFitting);
    stud.position.y = 0.76;
    mUnit.add(stud);

    const flag = new THREE.Mesh(mvFlagGeo, mats.copperLV);
    flag.position.y = 0.84;
    mUnit.add(flag);

    bushingsMVGroup.add(mUnit);
  });

  tagInteractive(bushingsMVGroup, 'bushingsMV', interactables);
  root.add(bushingsMVGroup);

  // ============================================================================
  // 9. RADIATOR COOLING BANKS (ONAN) WITH INDIVIDUAL STAMPED FINS
  // ============================================================================
  const radiatorsLeftGroup = new THREE.Group();
  const radiatorsRightGroup = new THREE.Group();

  // Extruded fluted radiator fin cross-section (profiled steel cooling channel fin)
  const finShape = new THREE.Shape();
  finShape.moveTo(-0.26, -0.008);
  finShape.lineTo(0.26, -0.008);
  finShape.lineTo(0.27, 0);
  finShape.lineTo(0.26, 0.008);
  finShape.lineTo(-0.26, 0.008);
  finShape.lineTo(-0.27, 0);
  finShape.closePath();

  const finGeo = trackGeo(
    new THREE.ExtrudeGeometry(finShape, {
      depth: 1.56,
      bevelEnabled: true,
      bevelThickness: 0.004,
      bevelSize: 0.004,
      bevelSegments: 1,
    })
  );
  finGeo.rotateX(Math.PI / 2);

  const manifoldPipeGeo = trackGeo(new THREE.CylinderGeometry(0.055, 0.055, 0.44, 16));
  const nozzlePipeGeo = trackGeo(new THREE.CylinderGeometry(0.052, 0.052, 0.42, 14));
  const flangeDiscGeo = trackGeo(new THREE.CylinderGeometry(0.095, 0.095, 0.028, 16));
  const valveWheelGeo2 = trackGeo(new THREE.TorusGeometry(0.065, 0.012, 8, 14));
  const tieBarGeo = trackGeo(new THREE.BoxGeometry(0.56, 0.025, 0.46));

  const buildRadiatorAssembly = (targetGroup: THREE.Group, sideSign: -1 | 1) => {
    const bankZPositions = [-0.56, 0, 0.56];
    const finsPerBank = 12;
    const totalFins = bankZPositions.length * finsPerBank;
    const finInst = new THREE.InstancedMesh(finGeo, mats.radiatorFinSteel, totalFins);
    let fIdx = 0;

    bankZPositions.forEach((bz) => {
      const bankCenterX = sideSign * 1.76;

      // 12 individual cooling fins per bank with air-convection gaps
      for (let f = 0; f < finsPerBank; f++) {
        const fz = bz - 0.195 + (f / (finsPerBank - 1)) * 0.39;
        dummy.position.set(bankCenterX, 1.94, fz);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        finInst.setMatrixAt(fIdx++, dummy.matrix);
      }

      // Upper & lower manifold collector headers
      [0.36, 1.96].forEach((hy) => {
        const manifold = new THREE.Mesh(manifoldPipeGeo, mats.radiatorPipeSteel);
        manifold.rotation.x = Math.PI / 2;
        manifold.position.set(bankCenterX, hy, bz);
        manifold.castShadow = true;
        targetGroup.add(manifold);

        // Tank-to-manifold stub pipe + butterfly isolation valve + flange
        const stub = new THREE.Mesh(nozzlePipeGeo, mats.radiatorPipeSteel);
        stub.rotation.z = Math.PI / 2;
        stub.position.set(sideSign * 1.48, hy, bz);
        targetGroup.add(stub);

        const vFlange = new THREE.Mesh(flangeDiscGeo, mats.galvanizedHardware);
        vFlange.rotation.z = Math.PI / 2;
        vFlange.position.set(sideSign * 1.44, hy, bz);
        targetGroup.add(vFlange);

        const vWheel = new THREE.Mesh(valveWheelGeo2, mats.brassFitting);
        vWheel.position.set(sideSign * 1.44, hy + 0.085, bz);
        targetGroup.add(vWheel);
      });

      // Structural tie-bars bracing the fins
      [0.72, 1.56].forEach((ty) => {
        const bar = new THREE.Mesh(tieBarGeo, mats.darkStructuralSteel);
        bar.position.set(bankCenterX, ty, bz);
        targetGroup.add(bar);
      });
    });

    finInst.instanceMatrix.needsUpdate = true;
    finInst.computeBoundingSphere();
    finInst.castShadow = !isSoftwareGl;
    finInst.receiveShadow = true;
    targetGroup.add(finInst);
  };

  buildRadiatorAssembly(radiatorsLeftGroup, -1);
  buildRadiatorAssembly(radiatorsRightGroup, 1);

  tagInteractive(radiatorsLeftGroup, 'radiators', interactables);
  tagInteractive(radiatorsRightGroup, 'radiators', interactables);
  root.add(radiatorsLeftGroup);
  root.add(radiatorsRightGroup);

  // ============================================================================
  // 10. CONSERVATOR TANK, BUCHHOLZ RELAY & BREATHER (conservatorGroup)
  // ============================================================================
  const conservatorGroup = new THREE.Group();

  // Horizontal expansion drum offset cleanly above rear-left cover
  const consX = -0.58;
  const consY = 3.16;
  const consZ = -0.35;

  const consBarrelGeo = trackGeo(new THREE.CylinderGeometry(0.32, 0.32, 1.58, 28));
  const consBarrel = new THREE.Mesh(consBarrelGeo, mats.conservatorSteel);
  consBarrel.rotation.z = Math.PI / 2;
  consBarrel.position.set(consX, consY, consZ);
  consBarrel.castShadow = true;
  conservatorGroup.add(consBarrel);

  // Domed end caps
  const capGeo = trackGeo(new THREE.SphereGeometry(0.32, 20, 14));
  [-0.79, 0.79].forEach((dx) => {
    const cap = new THREE.Mesh(capGeo, mats.conservatorSteel);
    cap.scale.set(0.4, 1, 1);
    cap.position.set(consX + dx, consY, consZ);
    conservatorGroup.add(cap);
  });

  // Structural A-frame support brackets connecting cover to conservator
  const legGeo = trackGeo(new THREE.BoxGeometry(0.055, 0.78, 0.055));
  [-0.52, 0.52].forEach((bx) => {
    [-0.18, 0.18].forEach((bz) => {
      const leg = new THREE.Mesh(legGeo, mats.darkStructuralSteel);
      leg.position.set(consX + bx, 2.66, consZ + bz);
      conservatorGroup.add(leg);
    });
  });

  // Magnetic Oil Level Gauge Dial on front end of conservator
  const dialHousingGeo = trackGeo(new THREE.CylinderGeometry(0.11, 0.11, 0.06, 20));
  const dialHousing = new THREE.Mesh(dialHousingGeo, mats.galvanizedHardware);
  dialHousing.rotation.x = Math.PI / 2;
  dialHousing.position.set(consX + 0.55, consY + 0.04, consZ + 0.33);
  conservatorGroup.add(dialHousing);

  const sightDiscGeo = trackGeo(new THREE.CylinderGeometry(0.085, 0.085, 0.02, 20));
  const sightDisc = new THREE.Mesh(sightDiscGeo, mats.oilSightGlass);
  sightDisc.rotation.x = Math.PI / 2;
  sightDisc.position.set(consX + 0.55, consY + 0.04, consZ + 0.36);
  conservatorGroup.add(sightDisc);

  // Inclined connecting pipe + Buchholz Gas Relay
  const buchPipeCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(consX + 0.35, 2.26, consZ + 0.1),
    new THREE.Vector3(consX + 0.35, 2.62, consZ + 0.04),
    new THREE.Vector3(consX + 0.25, 2.86, consZ),
  ]);
  const buchPipeGeo = trackGeo(new THREE.TubeGeometry(buchPipeCurve, 12, 0.036, 12, false));
  const buchPipe = new THREE.Mesh(buchPipeGeo, mats.radiatorPipeSteel);
  conservatorGroup.add(buchPipe);

  // Cast Buchholz Relay housing in the pipe
  const buchBodyGeo = trackGeo(new THREE.BoxGeometry(0.16, 0.18, 0.14));
  const buchBody = new THREE.Mesh(buchBodyGeo, mats.brassFitting);
  buchBody.position.set(consX + 0.35, 2.62, consZ + 0.04);
  conservatorGroup.add(buchBody);

  // Silica Gel Dehydrating Breather on left side
  const breatherPipeCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(consX - 0.75, consY + 0.25, consZ),
    new THREE.Vector3(consX - 0.92, consY + 0.25, consZ),
    new THREE.Vector3(consX - 0.92, consY - 0.65, consZ + 0.12),
  ]);
  const breatherPipeGeo = trackGeo(new THREE.TubeGeometry(breatherPipeCurve, 14, 0.018, 8, false));
  const breatherPipe = new THREE.Mesh(breatherPipeGeo, mats.galvanizedHardware);
  conservatorGroup.add(breatherPipe);

  const silicaCylinderGeo = trackGeo(new THREE.CylinderGeometry(0.065, 0.065, 0.28, 16));
  const silicaCylinder = new THREE.Mesh(silicaCylinderGeo, mats.silicaGelOrange);
  silicaCylinder.position.set(consX - 0.92, consY - 0.80, consZ + 0.12);
  conservatorGroup.add(silicaCylinder);

  tagInteractive(conservatorGroup, 'conservator', interactables);
  root.add(conservatorGroup);

  // ============================================================================
  // 11. MARSHALING CONTROL KIOSK (kioskGroup)
  // ============================================================================
  const kioskGroup = new THREE.Group();
  const kioskBoxGeo = trackGeo(new THREE.BoxGeometry(0.62, 0.96, 0.24));
  const kioskMesh = new THREE.Mesh(kioskBoxGeo, mats.kioskPanel);
  kioskMesh.position.set(0, 1.06, 0.96);
  kioskMesh.castShadow = true;
  kioskGroup.add(kioskMesh);

  const kioskFaceGeo = trackGeo(new THREE.PlaneGeometry(0.56, 0.88));
  const kioskFaceMesh = new THREE.Mesh(kioskFaceGeo, mats.kioskFace);
  kioskFaceMesh.position.set(0, 1.06, 1.084);
  kioskGroup.add(kioskFaceMesh);

  // Conduit pipe from kiosk to cover sensors
  const conduitCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.2, 1.54, 0.96),
    new THREE.Vector3(-0.2, 2.08, 0.96),
    new THREE.Vector3(-0.2, 2.18, 0.78),
  ]);
  const conduitGeo = trackGeo(new THREE.TubeGeometry(conduitCurve, 10, 0.018, 8, false));
  const conduitMesh = new THREE.Mesh(conduitGeo, mats.galvanizedHardware);
  kioskGroup.add(conduitMesh);

  tagInteractive(kioskGroup, 'kiosk', interactables);
  root.add(kioskGroup);

  // ============================================================================
  // 12. 3D CALLOUT ANCHORS (Follow each part cleanly during Disassembly!)
  // ============================================================================
  const calloutAnchors: Record<PartId, THREE.Object3D> = {
    tank: createAnchor('anchor-tank', 1.15, 1.18, 0.86, tankBodyGroup),
    tankCover: createAnchor('anchor-cover', 1.15, 2.30, -0.25, tankCoverGroup),
    bushingsHV: createAnchor('anchor-hv', 0.78, 4.18, 0.44, bushingsHVGroup),
    bushingsMV: createAnchor('anchor-mv', 0.86, 2.98, -0.52, bushingsMVGroup),
    radiators: createAnchor('anchor-rad', 1.95, 1.48, 0.35, radiatorsRightGroup),
    conservator: createAnchor('anchor-cons', consX - 0.1, consY + 0.35, consZ, conservatorGroup),
    insulation: createAnchor('anchor-insul', -0.4, 1.52, 0.42, insulationGroup),
    windingsHV: createAnchor('anchor-whv', 0.36, 1.24, 0.38, windingsHVGroup),
    windingsLV: createAnchor('anchor-wlv', -0.78, 1.55, 0.25, windingsLVGroup),
    core: createAnchor('anchor-core', 0.0, 1.88, 0.18, coreGroup),
    kiosk: createAnchor('anchor-kiosk', 0.0, 1.18, 1.12, kioskGroup),
  };

  return {
    root,
    groups: {
      bushingsHV: bushingsHVGroup,
      bushingsMV: bushingsMVGroup,
      conservator: conservatorGroup,
      radiatorsLeft: radiatorsLeftGroup,
      radiatorsRight: radiatorsRightGroup,
      kiosk: kioskGroup,
      tankCover: tankCoverGroup,
      tankBody: tankBodyGroup,
      insulation: insulationGroup,
      windingsHV: windingsHVGroup,
      windingsLV: windingsLVGroup,
      core: coreGroup,
    },
    xrayHelpers,
    interactables,
    calloutAnchors,
    hvArcPoints,
    dispose: () => {
      geometriesToDispose.forEach((g) => g.dispose());
      shadowMat.dispose();
      pressboardDoubleMat.dispose();
    },
  };
}
