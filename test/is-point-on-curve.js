import assert from 'node:assert'
import test from 'node:test'

import { isPointOnCurve, bezierPoint } from '../index.js'

test('isPointOnCurve should correctly determine if a point is on a Bezier curve within a specified tolerance', () => {
  // Define a sample set of Bezier curve points
  const curvePoints = [
    [10, 10],  // P0
    [20, 15],  // P1
    [30, 15],  // P2
    [40, 10]   // P3
  ]

  // Define a point that is on the curve
  const onCurvePoint = bezierPoint(0.5, ...curvePoints) // Midpoint of the curve

  // Define a point that is not on the curve
  const offCurvePoint = [25, 20]

  // Define the tolerance
  const tolerance = 1

  // Call the function and check if the points are on the curve
  const isOnCurve = isPointOnCurve(curvePoints, onCurvePoint, tolerance)
  const isOffCurve = isPointOnCurve(curvePoints, offCurvePoint, tolerance)

  // Assert that the function correctly identifies the on-curve point
  assert.strictEqual(isOnCurve, true, 'The function incorrectly identified an on-curve point')

  // Assert that the function correctly identifies the off-curve point
  assert.strictEqual(isOffCurve, false, 'The function incorrectly identified an off-curve point')
})
