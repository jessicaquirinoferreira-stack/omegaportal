import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INTRO_TOTAL_MS,
  getIntroPhaseAtTime,
  getIntroProgressPct,
  shouldShowIntroOnBoot,
} from './introSequence';

test('getIntroPhaseAtTime maps elapsed milliseconds across the 8s 4-act sequence', () => {
  assert.equal(INTRO_TOTAL_MS, 8000);
  assert.equal(getIntroPhaseAtTime(0), 1);
  assert.equal(getIntroPhaseAtTime(1399), 1);
  assert.equal(getIntroPhaseAtTime(1400), 2);
  assert.equal(getIntroPhaseAtTime(3399), 2);
  assert.equal(getIntroPhaseAtTime(3400), 3);
  assert.equal(getIntroPhaseAtTime(7299), 3);
  assert.equal(getIntroPhaseAtTime(7300), 4);
  assert.equal(getIntroPhaseAtTime(8500), 4);
});

test('getIntroProgressPct clamps safely between 0 and 100', () => {
  assert.equal(getIntroProgressPct(-50), 0);
  assert.equal(getIntroProgressPct(0), 0);
  assert.equal(getIntroProgressPct(INTRO_TOTAL_MS / 2), 50);
  assert.equal(getIntroProgressPct(INTRO_TOTAL_MS), 100);
  assert.equal(getIntroProgressPct(INTRO_TOTAL_MS + 1000), 100);
});

test('shouldShowIntroOnBoot always plays on open/refresh unless autostart=1 or reduced motion', () => {
  assert.equal(shouldShowIntroOnBoot({ storedCompleted: null }), true);
  assert.equal(shouldShowIntroOnBoot({ storedCompleted: 'true' }), true);
  assert.equal(shouldShowIntroOnBoot({}), true);
  assert.equal(shouldShowIntroOnBoot({ search: '?autostart=1', storedCompleted: null }), false);
  assert.equal(shouldShowIntroOnBoot({ prefersReducedMotion: true }), false);
  assert.equal(
    shouldShowIntroOnBoot({ forcePlay: true, storedCompleted: 'true', prefersReducedMotion: true }),
    true
  );
});
