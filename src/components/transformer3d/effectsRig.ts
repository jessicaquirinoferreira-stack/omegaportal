import * as THREE from 'three';

export interface MagneticFluxRig {
  group: THREE.Group;
  setVisible: (visible: boolean) => void;
  update: (time: number) => void;
  dispose: () => void;
}

export interface DielectricArcRig {
  group: THREE.Group;
  trigger: () => void;
  update: (delta: number) => boolean;
  dispose: () => void;
}

export function createMagneticFluxRig(parentCoreGroup: THREE.Group): MagneticFluxRig {
  const group = new THREE.Group();

  // Two closed magnetic circuit loops threading through the 3 core limbs and top/bottom yokes
  const leftLoopCurve = new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(-0.78, 0.34, 0),
      new THREE.Vector3(-0.78, 1.12, 0),
      new THREE.Vector3(-0.78, 1.88, 0),
      new THREE.Vector3(-0.39, 1.94, 0),
      new THREE.Vector3(0.0, 1.88, 0),
      new THREE.Vector3(0.0, 1.12, 0),
      new THREE.Vector3(0.0, 0.34, 0),
      new THREE.Vector3(-0.39, 0.28, 0),
    ],
    true
  );

  const rightLoopCurve = new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(0.78, 0.34, 0),
      new THREE.Vector3(0.78, 1.12, 0),
      new THREE.Vector3(0.78, 1.88, 0),
      new THREE.Vector3(0.39, 1.94, 0),
      new THREE.Vector3(0.0, 1.88, 0),
      new THREE.Vector3(0.0, 1.12, 0),
      new THREE.Vector3(0.0, 0.34, 0),
      new THREE.Vector3(0.39, 0.28, 0),
    ],
    true
  );

  // Glowing flux path guides wrapping the core circuit (front and back faces)
  const zOffset = 0.28;
  const tubeGeoL = new THREE.TubeGeometry(leftLoopCurve, 64, 0.038, 8, true);
  const tubeGeoR = new THREE.TubeGeometry(rightLoopCurve, 64, 0.038, 8, true);
  const tubeMat = new THREE.MeshBasicMaterial({
    color: 0x22d3ee,
    transparent: true,
    opacity: 0.88,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const tubeLFront = new THREE.Mesh(tubeGeoL, tubeMat);
  const tubeRFront = new THREE.Mesh(tubeGeoR, tubeMat);
  tubeLFront.position.z = zOffset;
  tubeRFront.position.z = zOffset;
  const tubeLBack = new THREE.Mesh(tubeGeoL, tubeMat);
  const tubeRBack = new THREE.Mesh(tubeGeoR, tubeMat);
  tubeLBack.position.z = -zOffset;
  tubeRBack.position.z = -zOffset;
  group.add(tubeLFront, tubeRFront, tubeLBack, tubeRBack);

  // Flowing directional flux nodes along both loops (front & back, InstancedMesh for zero GC)
  const nodesPerLoop = 16;
  const totalNodes = nodesPerLoop * 4;
  const beadGeo = new THREE.SphereGeometry(0.054, 10, 10);
  const beadMat = new THREE.MeshBasicMaterial({
    color: 0xf0f9ff,
    transparent: true,
    opacity: 1,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const beadInst = new THREE.InstancedMesh(beadGeo, beadMat, totalNodes);
  beadInst.frustumCulled = false;
  group.add(beadInst);

  parentCoreGroup.add(group);

  const _pos = new THREE.Vector3();
  const _mat = new THREE.Matrix4();

  return {
    group,
    setVisible: (visible: boolean) => {
      group.visible = visible;
    },
    update: (time: number) => {
      if (!group.visible) return;
      const safeTime = Number.isFinite(time) && time >= 0 ? time : 0;
      const speed = 0.18;
      for (let i = 0; i < nodesPerLoop; i++) {
        const u1 = (((i / nodesPerLoop) + safeTime * speed) % 1 + 1) % 1;
        leftLoopCurve.getPointAt(u1, _pos);
        _mat.makeTranslation(_pos.x, _pos.y, _pos.z + zOffset);
        beadInst.setMatrixAt(i, _mat);
        _mat.makeTranslation(_pos.x, _pos.y, _pos.z - zOffset);
        beadInst.setMatrixAt(nodesPerLoop * 2 + i, _mat);

        const u2 = (((i / nodesPerLoop) + safeTime * speed + 0.5) % 1 + 1) % 1;
        rightLoopCurve.getPointAt(u2, _pos);
        _mat.makeTranslation(_pos.x, _pos.y, _pos.z + zOffset);
        beadInst.setMatrixAt(nodesPerLoop + i, _mat);
        _mat.makeTranslation(_pos.x, _pos.y, _pos.z - zOffset);
        beadInst.setMatrixAt(nodesPerLoop * 3 + i, _mat);
      }
      beadInst.instanceMatrix.needsUpdate = true;
    },
    dispose: () => {
      tubeGeoL.dispose();
      tubeGeoR.dispose();
      tubeMat.dispose();
      beadGeo.dispose();
      beadMat.dispose();
    },
  };
}

export function createDielectricArcRig(
  parentBushingsGroup: THREE.Group,
  arcPoints: THREE.Vector3[]
): DielectricArcRig {
  const group = new THREE.Group();
  parentBushingsGroup.add(group);

  // Main jagged arc + secondary corona branches
  const segmentsPerSpan = 16;
  const spans = 2; // Phase A-B and Phase B-C
  const branches = 2;
  const totalSegments = spans * segmentsPerSpan * branches;
  const arcGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(totalSegments * 6);
  arcGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const arcMat = new THREE.LineBasicMaterial({
    color: 0xbae6fd,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const arcLines = new THREE.LineSegments(arcGeo, arcMat);
  arcLines.frustumCulled = false;
  group.add(arcLines);

  // Dynamic electric flash light
  const flashLight = new THREE.PointLight(0x38bdf8, 0, 8, 2);
  if (arcPoints.length >= 2) {
    flashLight.position.copy(arcPoints[1]);
  } else {
    flashLight.position.set(0, 4.5, 0.44);
  }
  group.add(flashLight);

  let pulseRemaining = 0;
  const pulseDuration = 0.45;

  const regenerateArcs = (intensity: number) => {
    if (arcPoints.length < 3) return;
    const posAttr = arcGeo.getAttribute('position') as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    let ptr = 0;

    for (let s = 0; s < spans; s++) {
      const pStart = arcPoints[s];
      const pEnd = arcPoints[s + 1];

      for (let b = 0; b < branches; b++) {
        let prevX = pStart.x;
        let prevY = pStart.y;
        let prevZ = pStart.z;

        const jitterAmp = (b === 0 ? 0.13 : 0.21) * (0.6 + intensity * 0.4);

        for (let seg = 1; seg <= segmentsPerSpan; seg++) {
          const t = seg / segmentsPerSpan;
          const envelope = Math.sin(t * Math.PI);
          const nextX = THREE.MathUtils.lerp(pStart.x, pEnd.x, t) + (seg < segmentsPerSpan ? (Math.random() - 0.5) * jitterAmp * 0.4 : 0);
          const nextY = THREE.MathUtils.lerp(pStart.y, pEnd.y, t) + (seg < segmentsPerSpan ? (Math.random() - 0.35) * jitterAmp * envelope : 0);
          const nextZ = THREE.MathUtils.lerp(pStart.z, pEnd.z, t) + (seg < segmentsPerSpan ? (Math.random() - 0.5) * jitterAmp * envelope : 0);

          arr[ptr++] = prevX;
          arr[ptr++] = prevY;
          arr[ptr++] = prevZ;
          arr[ptr++] = nextX;
          arr[ptr++] = nextY;
          arr[ptr++] = nextZ;

          prevX = nextX;
          prevY = nextY;
          prevZ = nextZ;
        }
      }
    }
    posAttr.needsUpdate = true;
  };

  return {
    group,
    trigger: () => {
      pulseRemaining = pulseDuration;
      regenerateArcs(1.0);
    },
    update: (delta: number) => {
      if (pulseRemaining <= 0) {
        arcMat.opacity = 0;
        flashLight.intensity = 0;
        return false;
      }
      pulseRemaining = Math.max(0, pulseRemaining - delta);
      const norm = pulseRemaining / pulseDuration;
      const flicker = 0.65 + Math.random() * 0.35;
      arcMat.opacity = Math.min(1, norm * 1.4) * flicker;
      flashLight.intensity = norm * 14 * flicker;
      regenerateArcs(norm);
      return true;
    },
    dispose: () => {
      arcGeo.dispose();
      arcMat.dispose();
    },
  };
}
