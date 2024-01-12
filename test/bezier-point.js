import assert from 'node:assert'
import test from 'node:test'

import { bezierPoint } from '../index.js'

test('bezierPoint should calculate the correct point on a cubic Bezier curve', () => {
  // Define a cubic Bezier curve with known control points
  const P0 = [0, 0]  // Start point
  const P1 = [0, 10] // First control point
  const P2 = [10, 10] // Second control point
  const P3 = [10, 0]  // End point

  // Define a parameter t
  const t = 0.5 // Midpoint of the curve

  // Calculate the point on the curve at t
  const point = bezierPoint(t, P0, P1, P2, P3)

  // Define the expected result for the midpoint of this curve
  const expectedPoint = [5, 7.5]

  // Check if the calculated point is close to the expected point
  assert(Math.abs(point[0] - expectedPoint[0]) < 0.01, 'X-coordinate of bezierPoint is incorrect')
  assert(Math.abs(point[1] - expectedPoint[1]) < 0.01, 'Y-coordinate of bezierPoint is incorrect')
})
