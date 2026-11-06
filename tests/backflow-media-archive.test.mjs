import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const root = 'backflow-operations-platform/media';

test('retained Backflow demonstration media matches its manifest', () => {
  const manifest = JSON.parse(readFileSync(`${root}/manifest.json`, 'utf8'));
  const metadata = JSON.parse(readFileSync(`${root}/sales-story-metadata.json`, 'utf8'));
  assert.equal(manifest.sales_story.duration_seconds, metadata.duration_seconds);
  for (const name of ['sales-story.mp4', 'sales-story-web.mp4', 'sales-story.vtt', 'sales-story-transcript.txt', 'sales-story-poster.jpg', 'sales-story-metadata.json']) {
    const path = `${root}/${name}`;
    const bytes = /\.(txt|vtt|json)$/.test(name)
      ? Buffer.from(readFileSync(path, 'utf8').replace(/\r\n/g, '\n'))
      : readFileSync(path);
    assert.equal(manifest.sha256[name], createHash('sha256').update(bytes).digest('hex'), name);
  }
});
