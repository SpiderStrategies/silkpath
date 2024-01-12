import assert from 'node:assert'
import test from 'node:test'

import { translatePath } from '../index.js'

test('translatePath should correctly translate M and L commands', () => {
  const path = 'M10,10 L20,20'
  const newX = 5
  const newY = 10
  const translated = translatePath(path, newX, newY)
  const expected = 'M15,20 L25,30'
  assert.strictEqual(translated, expected, 'Failed to translate M and L commands correctly')
})

test('translatePath should correctly translate C command', () => {
  const path = 'M10,10 C20,20,30,30,40,40'
  const newX = 10
  const newY = 5
  const translated = translatePath(path, newX, newY)
  const expected = 'M20,15 C30,25,40,35,50,45'
  assert.strictEqual(translated, expected, 'Failed to translate C command correctly')
})

test('translatePath should correctly translate Q command', () => {
  const path = 'M10,10 Q20,20,30,30'
  const newX = 3
  const newY = 6
  const translated = translatePath(path, newX, newY)
  const expected = 'M13,16 Q23,26,33,36'
  assert.strictEqual(translated, expected, 'Failed to translate Q command correctly')
})

test('translatePath should correctly translate A command', () => {
  const path = `M 49.5, 0 A 49.5,49.5,0,0,1,49.5,99 A 49.5,49.5,0,0,1,49.5,0 Z`
  const newX = 100
  const newY = 140
  const translated = translatePath(path, newX, newY)
  const expected = 'M149.5,140 A49.5 49.5 0 0 1 149.5 239 A49.5 49.5 0 0 1 149.5 140 Z'

  assert.strictEqual(translated, expected, 'Failed to translate A command correctly')
})
