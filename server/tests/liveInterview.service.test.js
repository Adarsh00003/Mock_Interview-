import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeLiveInterviewPayload } from '../services/liveInterview.service.js';

test('maps form payload into a valid live interview payload', () => {
  const payload = normalizeLiveInterviewPayload({
    candidateId: 'candidate123',
    jobTitle: 'Frontend Developer',
    description: 'Test interview',
    date: '2026-08-01',
    time: '14:30',
    duration: '60',
    mode: 'Online',
    meetingLink: 'https://zoom.us/123',
  });

  assert.equal(payload.title, 'Frontend Developer');
  assert.equal(payload.candidateId, 'candidate123');
  assert.equal(payload.duration, 60);
  assert.equal(payload.mode, 'Online');
  assert.equal(payload.meetingLink, 'https://zoom.us/123');
  assert.ok(payload.scheduledAt instanceof Date);
});

test('throws for missing required fields', () => {
  assert.throws(() => normalizeLiveInterviewPayload({ duration: '60' }), /candidateId/i);
});
