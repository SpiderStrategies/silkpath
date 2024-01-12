import assert from 'node:assert'
import test from 'node:test'

import { solveBezierForX, solveBezierForY, bezierPoint } from '../index.js'

test('solveBezierForX should find the correct t value and point for a given Y', () => {
  // Using a linear curve for simplicity (straight line from P0 to P3)
  const curve = [
    [0, 0], // P0
    [0, 0], // P1 (same as P0)
    [10, 10], // P2 (same as P3)
    [10, 10]  // P3
  ]
  const y = 5 // Midpoint Y value
  const expectedX = 5 // Midpoint X value for a linear curve
  const result = solveBezierForX(curve, y)

  assert(result !== null, 'solveBezierForX returned null')
  assert(Math.abs(result.point[0] - expectedX) < 0.01, 'solveBezierForX did not return the expected X value')
})

test('solveBezierForY should find the correct t value and point for a given X', () => {
  // Again, using a linear curve
  const curve = [
    [0, 0], // P0
    [0, 0], // P1 (same as P0)
    [10, 10], // P2 (same as P3)
    [10, 10]  // P3
  ]
  const x = 5 // Midpoint X value
  const expectedY = 5 // Midpoint Y value for a linear curve
  const result = solveBezierForY(curve, x)

  assert(result !== null, 'solveBezierForY returned null')
  assert(Math.abs(result.point[1] - expectedY) < 0.01, 'solveBezierForY did not return the expected Y value')
})

test('solveBezierForX should correctly find t value and point for a given Y on a cubic Bezier curve', () => {
  const curve = [
    [0, 0], // P0
    [10, 20], // P1
    [20, 20], // P2
    [30, 0]  // P3
  ]
  const t = 0.5 // Midpoint parameter
  const expectedPoint = bezierPoint(t, ...curve) // Expected point at t
  const y = expectedPoint[1] // Y value at t

  const result = solveBezierForX(curve, y)

  assert(result !== null, 'solveBezierForX returned null')
  assert(Math.abs(result.point[1] - y) < 0.01, 'solveBezierForX did not return the expected Y value')
})

test('solveBezierForY should correctly find t value and point for a given X on a cubic Bezier curve', () => {
  const curve = [
    [0, 0], // P0
    [10, 20], // P1
    [20, 20], // P2
    [30, 0]  // P3
  ]
  const t = 0.5 // Midpoint parameter
  const expectedPoint = bezierPoint(t, ...curve) // Expected point at t
  const x = expectedPoint[0] // X value at t

  const result = solveBezierForY(curve, x)

  assert(result !== null, 'solveBezierForY returned null')
  assert(Math.abs(result.point[0] - x) < 0.01, 'solveBezierForY did not return the expected X value')
})
