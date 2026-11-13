import * as THREE from 'three';

export interface ProceduralTextureSet {
  steelColor: THREE.CanvasTexture;
  steelBump: THREE.CanvasTexture;
  steelRoughness: THREE.CanvasTexture;
  siliconColor: THREE.CanvasTexture;
  siliconBump: THREE.CanvasTexture;
  copperColor: THREE.CanvasTexture;
  copperBump: THREE.CanvasTexture;
  copperRoughness: THREE.CanvasTexture;
  pressboardColor: THREE.CanvasTexture;
  pressboardBump: THREE.CanvasTexture;
  brushedMetalBump: THREE.CanvasTexture;
  concreteColor: THREE.CanvasTexture;
  concreteBump: THREE.CanvasTexture;
  nameplateColor: THREE.CanvasTexture;
  kioskFaceColor: THREE.CanvasTexture;
  contactShadowAlpha: THREE.CanvasTexture;
  dispose: () => void;
}

function makeCanvas(width: number, height: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  return [canvas, ctx];
}

function seededRand(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function configureTexture(
  canvas: HTMLCanvasElement,
  isColor: boolean,
  anisotropy: number,
  repeatX = 1,
  repeatY = 1
): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = isColor ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  tex.anisotropy = anisotropy;
  tex.needsUpdate = true;
  return tex;
}

export function createProceduralTextures(maxAnisotropy: number): ProceduralTextureSet {
  const aniso = Math.max(1, Math.min(maxAnisotropy, 16));
  const created: THREE.CanvasTexture[] = [];
  const track = (t: THREE.CanvasTexture) => {
    created.push(t);
    return t;
  };

  // 1. Industrial Painted Steel (RAL 7031 / Blue-Grey Industrial Epoxy + Weathering + Weld Micro-relief)
  const [stColC, stColCtx] = makeCanvas(512, 512);
  const [stBmpC, stBmpCtx] = makeCanvas(512, 512);
  const [stRghC, stRghCtx] = makeCanvas(512, 512);
  {
    const rng = seededRand(4011);
    stColCtx.fillStyle = '#3d4c55';
    stColCtx.fillRect(0, 0, 512, 512);
    stBmpCtx.fillStyle = '#808080';
    stBmpCtx.fillRect(0, 0, 512, 512);
    stRghCtx.fillStyle = '#8c8c8c';
    stRghCtx.fillRect(0, 0, 512, 512);

    // Subtle brushed steel & epoxy stipple
    for (let i = 0; i < 6000; i++) {
      const x = rng() * 512;
      const y = rng() * 512;
      const r = 1 + rng() * 3;
      const v = rng();
      stColCtx.fillStyle = v > 0.5 ? 'rgba(255,255,255,0.028)' : 'rgba(0,0,0,0.032)';
      stColCtx.fillRect(x, y, r * 2.2, r);
      const bv = Math.floor(118 + v * 22);
      stBmpCtx.fillStyle = `rgb(${bv},${bv},${bv})`;
      stBmpCtx.fillRect(x, y, r * 2, r);
      const rv = Math.floor(110 + rng() * 55);
      stRghCtx.fillStyle = `rgb(${rv},${rv},${rv})`;
      stRghCtx.fillRect(x, y, r * 3, r * 2);
    }

    // Subtle vertical panel weld / fabrication seams
    for (let sx = 128; sx < 512; sx += 128) {
      stColCtx.fillStyle = 'rgba(18, 25, 30, 0.28)';
      stColCtx.fillRect(sx - 2, 0, 4, 512);
      stBmpCtx.fillStyle = '#b4b4b4';
      stBmpCtx.fillRect(sx - 1, 0, 3, 512);
      stRghCtx.fillStyle = '#c8c8c8';
      stRghCtx.fillRect(sx - 2, 0, 4, 512);
    }

    // Subtle lower-edge oil/weathering gradient
    const grime = stColCtx.createLinearGradient(0, 0, 0, 512);
    grime.addColorStop(0, 'rgba(255,255,255,0.03)');
    grime.addColorStop(0.75, 'rgba(0,0,0,0)');
    grime.addColorStop(1, 'rgba(12,16,18,0.16)');
    stColCtx.fillStyle = grime;
    stColCtx.fillRect(0, 0, 512, 512);
  }

  // 2. Grain-Oriented Silicon Steel Core Laminations (Fine stacked sheets)
  const [siColC, siColCtx] = makeCanvas(512, 512);
  const [siBmpC, siBmpCtx] = makeCanvas(512, 512);
  {
    const rng = seededRand(8123);
    siColCtx.fillStyle = '#535c63';
    siColCtx.fillRect(0, 0, 512, 512);
    siBmpCtx.fillStyle = '#808080';
    siBmpCtx.fillRect(0, 0, 512, 512);

    // Individual 2px lamination sheets with slight metallic sheen variance
    for (let x = 0; x < 512; x += 3) {
      const shade = 68 + Math.floor(rng() * 34);
      const blueTint = 6 + Math.floor(rng() * 8);
      siColCtx.fillStyle = `rgb(${shade}, ${shade + 4}, ${shade + blueTint})`;
      siColCtx.fillRect(x, 0, 2, 512);
      // Dark insulation varnish gap (Carlita/C5 coating between steel sheets)
      siColCtx.fillStyle = '#1f2529';
      siColCtx.fillRect(x + 2, 0, 1, 512);

      siBmpCtx.fillStyle = rng() > 0.5 ? '#c4c4c4' : '#a8a8a8';
      siBmpCtx.fillRect(x, 0, 2, 512);
      siBmpCtx.fillStyle = '#262626';
      siBmpCtx.fillRect(x + 2, 0, 1, 512);
    }

    // Subtle rolling grain lines vertically
    for (let i = 0; i < 600; i++) {
      const x = rng() * 512;
      const y = rng() * 512;
      siColCtx.fillStyle = 'rgba(255,255,255,0.035)';
      siColCtx.fillRect(x, y, 1, 24 + rng() * 48);
    }
  }

  // 3. Electrolytic Copper Winding Conductors (Individual insulated strands & turns)
  const [cuColC, cuColCtx] = makeCanvas(512, 512);
  const [cuBmpC, cuBmpCtx] = makeCanvas(512, 512);
  const [cuRghC, cuRghCtx] = makeCanvas(512, 512);
  {
    const rng = seededRand(9941);
    cuColCtx.fillStyle = '#b96534';
    cuColCtx.fillRect(0, 0, 512, 512);
    cuBmpCtx.fillStyle = '#808080';
    cuBmpCtx.fillRect(0, 0, 512, 512);
    cuRghCtx.fillStyle = '#505050';
    cuRghCtx.fillRect(0, 0, 512, 512);

    // Individual copper turn bands (64 turns per tile)
    const step = 8;
    for (let y = 0; y < 512; y += step) {
      const tone = rng() * 18 - 9;
      const grad = cuColCtx.createLinearGradient(0, y, 0, y + step);
      grad.addColorStop(0, `rgb(${115 + tone}, ${55 + tone * 0.5}, 25)`);
      grad.addColorStop(0.25, `rgb(${205 + tone}, ${114 + tone * 0.6}, ${58 + tone * 0.4})`);
      grad.addColorStop(0.55, `rgb(${228 + tone}, ${134 + tone * 0.6}, ${74 + tone * 0.4})`);
      grad.addColorStop(0.85, `rgb(${168 + tone}, ${86 + tone * 0.5}, ${42 + tone * 0.3})`);
      grad.addColorStop(1, '#582914');
      cuColCtx.fillStyle = grad;
      cuColCtx.fillRect(0, y, 512, step);

      // Rounded conductor bump profile
      const bGrad = cuBmpCtx.createLinearGradient(0, y, 0, y + step);
      bGrad.addColorStop(0, '#222222');
      bGrad.addColorStop(0.5, '#f0f0f0');
      bGrad.addColorStop(1, '#222222');
      cuBmpCtx.fillStyle = bGrad;
      cuBmpCtx.fillRect(0, y, 512, step);

      // Rougher in the turn grooves, glossier enameled copper crown
      const rGrad = cuRghCtx.createLinearGradient(0, y, 0, y + step);
      rGrad.addColorStop(0, '#b5b5b5');
      rGrad.addColorStop(0.5, '#3b3b3b');
      rGrad.addColorStop(1, '#b5b5b5');
      cuRghCtx.fillStyle = rGrad;
      cuRghCtx.fillRect(0, y, 512, step);
    }

    // Diagonal paper-wrap / varnish micro texture
    for (let i = 0; i < 400; i++) {
      const x = rng() * 512;
      const y = rng() * 512;
      cuColCtx.fillStyle = 'rgba(255, 215, 175, 0.05)';
      cuColCtx.fillRect(x, y, 18, 2);
    }
  }

  // 4. Pressboard & Thermally Upgraded Kraft Insulation
  const [pbColC, pbColCtx] = makeCanvas(256, 256);
  const [pbBmpC, pbBmpCtx] = makeCanvas(256, 256);
  {
    const rng = seededRand(3319);
    pbColCtx.fillStyle = '#c49b63';
    pbColCtx.fillRect(0, 0, 256, 256);
    pbBmpCtx.fillStyle = '#808080';
    pbBmpCtx.fillRect(0, 0, 256, 256);

    for (let i = 0; i < 3200; i++) {
      const x = rng() * 256;
      const y = rng() * 256;
      const len = 3 + rng() * 9;
      pbColCtx.fillStyle = rng() > 0.5 ? 'rgba(92, 58, 22, 0.14)' : 'rgba(235, 205, 155, 0.12)';
      pbColCtx.fillRect(x, y, len, 1.2);
      const g = Math.floor(110 + rng() * 40);
      pbBmpCtx.fillStyle = `rgb(${g},${g},${g})`;
      pbBmpCtx.fillRect(x, y, len, 1);
    }
  }

  // 5. Brushed Steel / Galvanized Flanges
  const [brBmpC, brBmpCtx] = makeCanvas(256, 256);
  {
    const rng = seededRand(5521);
    brBmpCtx.fillStyle = '#808080';
    brBmpCtx.fillRect(0, 0, 256, 256);
    for (let y = 0; y < 256; y++) {
      const v = Math.floor(108 + rng() * 44);
      brBmpCtx.fillStyle = `rgb(${v},${v},${v})`;
      brBmpCtx.fillRect(0, y, 256, 1);
    }
  }

  // 6. Concrete Substation Plinth
  const [cnColC, cnColCtx] = makeCanvas(512, 512);
  const [cnBmpC, cnBmpCtx] = makeCanvas(512, 512);
  {
    const rng = seededRand(7009);
    cnColCtx.fillStyle = '#252b31';
    cnColCtx.fillRect(0, 0, 512, 512);
    cnBmpCtx.fillStyle = '#808080';
    cnBmpCtx.fillRect(0, 0, 512, 512);

    for (let i = 0; i < 9000; i++) {
      const x = rng() * 512;
      const y = rng() * 512;
      const s = 1 + rng() * 2.5;
      const lum = Math.floor(26 + rng() * 30);
      cnColCtx.fillStyle = `rgb(${lum},${lum + 4},${lum + 8})`;
      cnColCtx.fillRect(x, y, s, s);
      const b = Math.floor(90 + rng() * 75);
      cnBmpCtx.fillStyle = `rgb(${b},${b},${b})`;
      cnBmpCtx.fillRect(x, y, s, s);
    }

    // Expansion joint grid lines
    cnColCtx.strokeStyle = 'rgba(10, 14, 18, 0.55)';
    cnColCtx.lineWidth = 3;
    cnColCtx.strokeRect(2, 2, 508, 508);
    cnColCtx.beginPath();
    cnColCtx.moveTo(256, 0);
    cnColCtx.lineTo(256, 512);
    cnColCtx.moveTo(0, 256);
    cnColCtx.lineTo(512, 256);
    cnColCtx.stroke();
  }

  // 7. Official Engraved Stainless Nameplate (Preserving Omega project specs accurately)
  const [npC, npCtx] = makeCanvas(512, 320);
  {
    npCtx.fillStyle = '#182026';
    npCtx.fillRect(0, 0, 512, 320);
    npCtx.strokeStyle = '#d1d9e0';
    npCtx.lineWidth = 5;
    npCtx.strokeRect(10, 10, 492, 300);

    // Header band
    npCtx.fillStyle = '#0a3d4a';
    npCtx.fillRect(14, 14, 484, 52);
    npCtx.fillStyle = '#e5c158';
    npCtx.font = 'bold 21px monospace';
    npCtx.fillText('OMEGA ENGENHARIA', 28, 43);
    npCtx.fillStyle = '#ffffff';
    npCtx.font = 'bold 13px monospace';
    npCtx.fillText('TRANSFORMADOR DE POTÊNCIA TRIFÁSICO', 28, 60);

    // Spec rows (using registered data only + reference note)
    const rows = [
      ['CLASSE REFERÊNCIA', 'ATÉ 500 kV • 60 Hz'],
      ['POTÊNCIA INDICADA', '30 / 40 MVA'],
      ['REFRIGERAÇÃO', 'ONAN (Óleo / Ar Natural)'],
      ['ELEVAÇÃO DE TEMP.', '65 °C • ÓLEO ISOLANTE'],
      ['NORMAS TÉCNICAS', 'ABNT NBR 5356 / IEC 60076'],
      ['CONSTRUÇÃO', 'MODELO VISUAL DE REFERÊNCIA'],
    ];

    npCtx.font = '14px monospace';
    rows.forEach(([k, v], i) => {
      const y = 96 + i * 33;
      npCtx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.01)';
      npCtx.fillRect(22, y - 18, 468, 28);
      npCtx.fillStyle = '#94a3b8';
      npCtx.fillText(k, 30, y);
      npCtx.fillStyle = '#f8fafc';
      npCtx.fillText(v, 225, y);
    });

    // Corner rivets
    [24, 488].forEach((rx) => {
      [24, 296].forEach((ry) => {
        npCtx.fillStyle = '#cbd5e1';
        npCtx.beginPath();
        npCtx.arc(rx, ry, 4.5, 0, Math.PI * 2);
        npCtx.fill();
      });
    });
  }

  // 8. Marshaling Kiosk Front Panel (Analog OTI/WTI dials + mimic)
  const [kfC, kfCtx] = makeCanvas(256, 384);
  {
    kfCtx.fillStyle = '#2d3740';
    kfCtx.fillRect(0, 0, 256, 384);
    kfCtx.strokeStyle = '#182026';
    kfCtx.lineWidth = 6;
    kfCtx.strokeRect(6, 6, 244, 372);

    // Two round thermometer dials (OTI & WTI)
    const drawDial = (cx: number, cy: number, label: string, needleDeg: number) => {
      kfCtx.fillStyle = '#0f172a';
      kfCtx.beginPath();
      kfCtx.arc(cx, cy, 34, 0, Math.PI * 2);
      kfCtx.fill();
      kfCtx.strokeStyle = '#94a3b8';
      kfCtx.lineWidth = 3;
      kfCtx.stroke();

      kfCtx.fillStyle = '#f8fafc';
      kfCtx.beginPath();
      kfCtx.arc(cx, cy, 29, 0, Math.PI * 2);
      kfCtx.fill();

      // Scale ticks
      for (let a = -135; a <= 135; a += 27) {
        const rad = ((a - 90) * Math.PI) / 180;
        kfCtx.strokeStyle = a > 60 ? '#dc2626' : '#1e293b';
        kfCtx.lineWidth = 2;
        kfCtx.beginPath();
        kfCtx.moveTo(cx + Math.cos(rad) * 20, cy + Math.sin(rad) * 20);
        kfCtx.lineTo(cx + Math.cos(rad) * 26, cy + Math.sin(rad) * 26);
        kfCtx.stroke();
      }

      // Needle
      const nRad = ((needleDeg - 90) * Math.PI) / 180;
      kfCtx.strokeStyle = '#dc2626';
      kfCtx.lineWidth = 2.5;
      kfCtx.beginPath();
      kfCtx.moveTo(cx, cy);
      kfCtx.lineTo(cx + Math.cos(nRad) * 22, cy + Math.sin(nRad) * 22);
      kfCtx.stroke();

      kfCtx.fillStyle = '#0f172a';
      kfCtx.font = 'bold 9px monospace';
      kfCtx.textAlign = 'center';
      kfCtx.fillText(label, cx, cy + 16);
    };

    drawDial(76, 86, 'OTI °C', -18);
    drawDial(180, 86, 'WTI °C', 14);

    // Digital relay / status window
    kfCtx.fillStyle = '#0a1622';
    kfCtx.fillRect(34, 152, 188, 68);
    kfCtx.strokeStyle = '#475569';
    kfCtx.lineWidth = 2;
    kfCtx.strokeRect(34, 152, 188, 68);

    kfCtx.fillStyle = '#10b981';
    kfCtx.font = 'bold 12px monospace';
    kfCtx.textAlign = 'left';
    kfCtx.fillText('BUCHHOLZ: NORMAL', 46, 176);
    kfCtx.fillStyle = '#38bdf8';
    kfCtx.fillText('NÍVEL ÓLEO: OK', 46, 196);
    kfCtx.fillStyle = '#eab308';
    kfCtx.fillText('TEMP MAX: 65 °C', 46, 212);

    // Louvers at bottom
    for (let y = 264; y < 344; y += 10) {
      kfCtx.fillStyle = '#151c22';
      kfCtx.fillRect(42, y, 172, 4);
    }

    // Door handle
    kfCtx.fillStyle = '#94a3b8';
    kfCtx.fillRect(216, 190, 12, 42);
  }

  // 9. Soft radial contact shadow
  const [csC, csCtx] = makeCanvas(256, 256);
  {
    const grad = csCtx.createRadialGradient(128, 128, 18, 128, 128, 124);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
    grad.addColorStop(0.55, 'rgba(0, 0, 0, 0.42)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0.0)');
    csCtx.fillStyle = grad;
    csCtx.fillRect(0, 0, 256, 256);
  }

  return {
    steelColor: track(configureTexture(stColC, true, aniso, 2, 2)),
    steelBump: track(configureTexture(stBmpC, false, aniso, 2, 2)),
    steelRoughness: track(configureTexture(stRghC, false, aniso, 2, 2)),
    siliconColor: track(configureTexture(siColC, true, aniso, 3, 2)),
    siliconBump: track(configureTexture(siBmpC, false, aniso, 3, 2)),
    copperColor: track(configureTexture(cuColC, true, aniso, 2, 3)),
    copperBump: track(configureTexture(cuBmpC, false, aniso, 2, 3)),
    copperRoughness: track(configureTexture(cuRghC, false, aniso, 2, 3)),
    pressboardColor: track(configureTexture(pbColC, true, aniso, 2, 2)),
    pressboardBump: track(configureTexture(pbBmpC, false, aniso, 2, 2)),
    brushedMetalBump: track(configureTexture(brBmpC, false, aniso, 2, 2)),
    concreteColor: track(configureTexture(cnColC, true, aniso, 4, 4)),
    concreteBump: track(configureTexture(cnBmpC, false, aniso, 4, 4)),
    nameplateColor: track(configureTexture(npC, true, aniso, 1, 1)),
    kioskFaceColor: track(configureTexture(kfC, true, aniso, 1, 1)),
    contactShadowAlpha: track(configureTexture(csC, false, aniso, 1, 1)),
    dispose: () => {
      created.forEach((t) => t.dispose());
    },
  };
}
