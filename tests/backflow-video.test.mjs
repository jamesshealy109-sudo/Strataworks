import test from 'node:test';
import assert from 'node:assert/strict';
let createVideoProgressTracker = () => () => null;
try { ({ createVideoProgressTracker } = await import('../backflow-operations-platform/video-progress.mjs')); } catch (error) { if (error.code !== 'ERR_MODULE_NOT_FOUND') throw error; }

test('video measurement records each crossed milestone once, including after a seek', () => {
  const track = createVideoProgressTracker();
  assert.deepEqual(track(16, 64), [25]);
  assert.deepEqual(track(17, 64), []);
  assert.deepEqual(track(50, 64), [50, 75]);
  assert.deepEqual(track(0, 64), []);
  assert.deepEqual(track(64, 64), []);
});
test('invalid or unloaded media cannot produce progress events', () => {
  const track = createVideoProgressTracker();
  for (const args of [[1,0],[0,NaN],[NaN,64],[-1,64],[1,Infinity],[Infinity,64]]) assert.deepEqual(track(...args), []);
  assert.deepEqual(track(16,64), [25]);
});
