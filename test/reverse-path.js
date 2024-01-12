import assert from 'node:assert'
import test from 'node:test'

import { reversePath } from '../index.js'

test('reversePath should correctly reverse a Bezier path', () => {
  // Define a sample Bezier path to be reversed
  const inputPath = 'M10,10 C20,20,30,30,40,40'

  // Call the function with the sample path
  const result = reversePath(inputPath)

  // Define the expected result
  const expected = 'M40,40 C30,30,20,20,10,10'

  // Assert that the function output matches the expected result
  assert.strictEqual(result, expected, 'The function did not reverse the Bezier path as expected')
})
