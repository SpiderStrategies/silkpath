import assert from 'node:assert'
import test from 'node:test'

import { getBezierLength, bezierPoint } from '../index.js'

test('getBezierLength should calculate the approximate length of a Bezier curve', () => {
  // Define a simple straight-line cubic Bezier curve (effectively a line from [0, 0] to [10, 10])
  const curve = [
    [0, 0],   // P0
    [0, 0],   // P1 (same as P0)
    [10, 10], // P2 (same as P3)
    [10, 10]  // P3
  ]

  // The expected length of the curve (straight line diagonal in a 10x10 square)
  const expectedLength = Math.sqrt(10 * 10 + 10 * 10)

  // Calculate the approximate length of the curve
  const length = getBezierLength(curve, 100)

  // Assert that the calculated length is close to the expected length
  assert(Math.abs(length - expectedLength) < 1, 'getBezierLength did not return the expected length')
})
