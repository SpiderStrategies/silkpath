import assert from 'node:assert'
import test from 'node:test'

import { mirrorPath as mirror } from '../index.js'

test('mirrors M commands correctly', () => {
  const path = 'M 10 20'
  const mirroredPath = mirror(path, 10)
  assert.strictEqual(mirroredPath, 'M 10 20', 'The M command should mirror correctly with same x-coordinate as mirror line')
})

test('mirrors L commands correctly', () => {
  const path = 'M 10 20 L 30 40'
  const mirroredPath = mirror(path, 20)
  assert.strictEqual(mirroredPath, 'M 30 20 L 10 40', 'The L command coordinates should be mirrored correctly')
})

test('mirrors C commands correctly', () => {
  const path = 'M 10 20 C 30 40 50 60 70 80'
  const mirroredPath = mirror(path, 50)
  assert.strictEqual(mirroredPath, 'M 90 20 C 70 40 50 60 30 80', 'The C command coordinates should be mirrored correctly')
})

test('handles Z commands properly without changes', () => {
  const path = 'M 10 20 L 30 40 Z'
  const mirroredPath = mirror(path, 10)
  assert.strictEqual(mirroredPath, 'M 10 20 L -10 40 Z', 'The Z command should be copied as is and other coordinates mirrored correctly')
})

test('handles complex paths with mixed commands', () => {
  const path = 'M 10 20 L 25 30 C 40 50 60 70 80 90 Z'
  const mirroredPath = mirror(path, 50)
  assert.strictEqual(mirroredPath, 'M 90 20 L 75 30 C 60 50 40 70 20 90 Z', 'Mixed commands should be handled and coordinates mirrored correctly')
})

test('handles paths with only Z command', () => {
  const path = 'M 10 10 Z'
  const mirroredPath = mirror(path, 5)
  assert.strictEqual(mirroredPath, 'M 0 10 Z', 'The Z command in a path should be handled correctly even when the starting move is mirrored')
})
