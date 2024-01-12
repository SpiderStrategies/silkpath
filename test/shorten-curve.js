import assert from 'node:assert'
import test from 'node:test'

import { shortenCurve, getBezierLength } from '../index.js'

test('shortenCurve should correctly calculate the t value to shorten a Bezier curve by a given length', () => {
  // Define a simple cubic Bezier curve
  const curve = [
    [0, 0],   // P0
    [10, 0],  // P1
    [10, 10], // P2
    [0, 10]   // P3
  ]

  // Total length of the curve
  const totalLength = getBezierLength(curve, 1000)

  // Length to shorten by
  const shortenBy = totalLength / 2

  // Expected t value after shortening (approximately half)
  const expectedT = 0.5

  // Calculate the t value to shorten the curve
  const t = shortenCurve(curve, shortenBy, 1000)

  // Assert that the calculated t value is close to the expected value
  assert(Math.abs(t - expectedT) < 0.05, 'shortenCurve did not return the expected t value')
})
