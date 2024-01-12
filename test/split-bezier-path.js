import assert from 'node:assert'
import test from 'node:test'

import { splitBezierPath } from '../index.js'

test('splitBezierPath splits two curves into two paths', () => {
  // Define a sample Bezier path to be split
  const inputPath = 'M10,10 C20,20,30,30,40,40 C50,50,60,60,70,70'

  // Call the function with the sample path
  const result = splitBezierPath(inputPath)

  // Define the expected result
  const expected = [
    'M10,10 C20,20,30,30,40,40 ',
    'M40,40 C50,50,60,60,70,70'
  ]

  // Assert that the function output matches the expected result
  assert.deepStrictEqual(result, expected, 'The function did not split the Bezier path as expected')
})
