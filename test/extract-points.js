import assert from 'node:assert'
import test from 'node:test'

import { extractPoints } from '../index.js'

test('extractPoints should correctly extract points from an SVG path', () => {
  // Define a sample SVG path
  const path = 'M10,10 C20,20,30,30,40,40'

  // Call the function with the sample path
  const points = extractPoints(path)

  // Define the expected array of points
  const expectedPoints = [
    [10, 10], // M command point
    [20, 20], // First C command control point
    [30, 30], // Second C command control point
    [40, 40]  // C command end point
  ]

  // Assert that the extracted points match the expected points
  assert.deepStrictEqual(points, expectedPoints, 'extractPoints did not return the expected points')
})
