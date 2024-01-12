import assert from 'node:assert'
import test from 'node:test'

import { mirrorCurve } from '../index.js'

test('mirrorCurve should correctly mirror a Bezier curve along a specified axis', () => {
  // Define a sample set of Bezier curve points
  const curvePoints = [
    [10, 10],
    [20, 20],
    [30, 30],
    [40, 40]
  ]

  // Define the axis value to mirror around
  const axis = 25

  // Call the function with the sample points and axis
  const result = mirrorCurve(curvePoints, axis);

  // Define the expected mirrored points
  const expected = [
    [40, 10],  // Mirrored point of [10, 10]
    [30, 20],  // Mirrored point of [20, 20]
    [20, 30],  // Mirrored point of [30, 30]
    [10, 40]   // Mirrored point of [40, 40]
  ]

  // Assert that the function output matches the expected mirrored points
  assert.deepStrictEqual(result, expected, 'The function did not mirror the Bezier curve points as expected')
})
