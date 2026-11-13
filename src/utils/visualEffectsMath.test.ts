import test from 'node:test';
import assert from 'node:assert/strict';
import { computeTiltAngles, getEditorialProjectCardClass } from './visualEffectsMath';

test('computeTiltAngles returns neutral center tilt and clamps extremes cleanly', () => {
  const center = computeTiltAngles({
    clientX: 150,
    clientY: 100,
    rectLeft: 50,
    rectTop: 50,
    rectWidth: 200,
    rectHeight: 100,
    maxTiltDeg: 3,
  });

  assert.equal(center.rotateX, 0);
  assert.equal(center.rotateY, 0);
  assert.equal(center.spotlightX, 100);
  assert.equal(center.spotlightY, 50);

  const extreme = computeTiltAngles({
    clientX: 999,
    clientY: -50,
    rectLeft: 50,
    rectTop: 50,
    rectWidth: 200,
    rectHeight: 100,
    maxTiltDeg: 3,
  });

  assert.equal(extreme.rotateY, 3);
  assert.equal(extreme.rotateX, 3);
  assert.equal(extreme.spotlightX, 200);
  assert.equal(extreme.spotlightY, 0);
});

test('getEditorialProjectCardClass keeps 14 unfiltered projects balanced across 2-col, 3-col, and 4-col grids without orphan gaps', () => {
  let totalSmCells = 0;
  let totalLgCells = 0;
  let totalXlCells = 0;

  for (let i = 0; i < 14; i++) {
    const layout = getEditorialProjectCardClass({
      index: i,
      totalCount: 14,
      isUnfiltered: true,
    });
    totalSmCells += layout.spanClass.includes('sm:col-span-2') ? 2 : 1;
    totalLgCells += layout.spanClass.includes('lg:col-span-2') ? 2 : 1;
    totalXlCells += layout.spanClass.includes('xl:col-span-2') ? 2 : 1;
  }

  assert.equal(totalSmCells % 2, 0);
  assert.equal(totalLgCells % 3, 0);
  assert.equal(totalXlCells % 4, 0);

  const filtered = getEditorialProjectCardClass({
    index: 0,
    totalCount: 4,
    isUnfiltered: false,
  });
  assert.equal(filtered.isFeatured, false);
  assert.equal(filtered.spanClass, '');
});
