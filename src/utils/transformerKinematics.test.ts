import test from 'node:test';
import assert from 'node:assert/strict';
import {
  clamp01,
  subPhaseEase,
  computeExplodedOffsets,
  getActiveDisassemblyPhase,
  TRANSFORMER_PARTS_CATALOG,
  CAMERA_PRESETS,
  PartId,
} from './transformerKinematics';

test('clamp01 constrains values cleanly between 0 and 1', () => {
  assert.equal(clamp01(-0.5), 0);
  assert.equal(clamp01(0), 0);
  assert.equal(clamp01(0.42), 0.42);
  assert.equal(clamp01(1), 1);
  assert.equal(clamp01(1.8), 1);
});

test('subPhaseEase stays 0 before start, 1 after end, and monotonic inside range', () => {
  assert.equal(subPhaseEase(0.1, 0.2, 0.5), 0);
  assert.equal(subPhaseEase(0.2, 0.2, 0.5), 0);
  assert.equal(subPhaseEase(0.5, 0.2, 0.5), 1);
  assert.equal(subPhaseEase(0.9, 0.2, 0.5), 1);

  const mid = subPhaseEase(0.35, 0.2, 0.5);
  assert.ok(mid > 0.49 && mid < 0.51, `Expected ~0.5 at midpoint, got ${mid}`);
});

test('computeExplodedOffsets returns exact zero offsets when assembled (progress = 0)', () => {
  const assembled = computeExplodedOffsets(0);
  for (const [key, vec] of Object.entries(assembled)) {
    assert.deepEqual(vec, [0, 0, 0], `Component ${key} should have zero offset at progress=0`);
  }
});

test('computeExplodedOffsets separates components along non-colliding axes at 100%', () => {
  const exploded = computeExplodedOffsets(1);
  // Radiators separate symmetrically along X
  assert.ok(exploded.radiatorsLeft[0] < -1.5);
  assert.ok(exploded.radiatorsRight[0] > 1.5);

  // Tank moves backward (-Z) while windings move forward (+Z) so active part is never occluded
  assert.ok(exploded.tankBody[2] < -2.5);
  assert.ok(exploded.windingsLV[2] > 0);
  assert.ok(exploded.windingsHV[2] > exploded.windingsLV[2]);
  assert.ok(exploded.insulation[2] > exploded.windingsHV[2]);

  // Bushings & cover move upward (+Y)
  assert.ok(exploded.tankCover[1] > 1.0);
  assert.ok(exploded.bushingsHV[1] > exploded.tankCover[1]);
  assert.ok(exploded.bushingsMV[1] > exploded.tankCover[1]);
});

test('getActiveDisassemblyPhase maps progress across all 6 engineering phases', () => {
  assert.equal(getActiveDisassemblyPhase(0).phase, 1);
  assert.equal(getActiveDisassemblyPhase(0.2).phase, 2);
  assert.equal(getActiveDisassemblyPhase(0.45).phase, 3);
  assert.equal(getActiveDisassemblyPhase(0.65).phase, 4);
  assert.equal(getActiveDisassemblyPhase(0.85).phase, 5);
  assert.equal(getActiveDisassemblyPhase(1).phase, 6);
});

test('all transformer parts have complete Portuguese engineering metadata and valid camera presets', () => {
  const requiredParts: PartId[] = [
    'tank',
    'tankCover',
    'bushingsHV',
    'bushingsMV',
    'radiators',
    'conservator',
    'insulation',
    'windingsHV',
    'windingsLV',
    'core',
    'kiosk',
  ];

  for (const id of requiredParts) {
    const info = TRANSFORMER_PARTS_CATALOG[id];
    assert.ok(info, `Missing catalog info for ${id}`);
    assert.ok(info.name.length > 5);
    assert.ok(info.functionText.length > 20);
    assert.ok(info.importanceText.length > 20);
    assert.ok(info.locationText.length > 10);
    assert.ok(info.relationshipsText.length > 20);
  }

  assert.equal(CAMERA_PRESETS.length, 7);
});
