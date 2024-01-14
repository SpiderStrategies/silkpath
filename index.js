/**
 * Splits a Bezier path into two separate paths.
 *
 * @param {string} inputPath - The SVG path string to be split.
 * @returns {Array<string>} An array containing two path strings.
 */
export function splitBezierPath(inputPath) {
  const commands = inputPath.split(/(?=[MC])/)
  const moveCommand = commands[0]
  const curve1 = commands[1]
  const curve2 = commands[2]
  const curve1EndPoint = curve1.split(',').slice(-2).join(',')
  const path1 = moveCommand + curve1
  const path2 = `M${curve1EndPoint}${curve2}`

  return [path1, path2]
}

/**
 * Performs linear interpolation between two points.
 *
 * @param {Array<number>} p0 - The first point [x1, y1].
 * @param {Array<number>} p1 - The second point [x2, y2].
 * @param {number} t - The interpolation factor (0 to 1).
 * @returns {Array<number>} The interpolated point [x, y].
 */
export function linearInterpolate(p0, p1, t) {
  return [(1 - t) * p0[0] + t * p1[0], (1 - t) * p0[1] + t * p1[1]]
}

/**
 * Calculates new control points for a cubic Bézier curve segment.
 *
 * @param {number} t - The parameter value where the curve segment starts.
 * @param {Array<number>} p0 - The start point [x0, y0].
 * @param {Array<number>} p1 - The first control point [x1, y1].
 * @param {Array<number>} p2 - The second control point [x2, y2].
 * @param {Array<number>} p3 - The end point [x3, y3].
 * @returns {Object} New starting point, first and second new control points.
 */
export function calculateSubcurve(t, p0, p1, p2, p3) {
  const A = linearInterpolate(p0, p1, t)
  const B = linearInterpolate(p1, p2, t)
  const C = linearInterpolate(p2, p3, t)
  const D = linearInterpolate(A, B, t)
  const E = linearInterpolate(B, C, t)

  return {
    start: linearInterpolate(D, E, t),
    controls: [E, C],
  }
}

/**
 * Extracts points from an SVG path.
 *
 * @param {string} path - The SVG path string.
 * @returns {Array<Array<number>>} An array of points [x, y].
 */
export function extractPoints(path) {
  const components = path.split(/(?=[MC])/)
  let points = []

  components.forEach(component => {
    const command = component.substring(0, 1)
    const coords = component.substring(1).trim()

    if (coords.length > 0) {
      const coordPairs = coords.split(/[\s,]+/)
      for (let i = 0; i < coordPairs.length; i += 2) {
        const x = parseFloat(coordPairs[i])
        const y = parseFloat(coordPairs[i + 1])
        points.push([x, y])
      }
    }
  })

  return points
}

/**
 * Calculates a point on a cubic Bézier curve for a given parameter t.
 *
 * @param {number} t - The parameter t, ranging from 0 to 1, representing the position along the curve.
 * @param {Array<number>} P0 - The start point of the Bézier curve, given as [x, y].
 * @param {Array<number>} P1 - The first control point of the Bézier curve, given as [x, y].
 * @param {Array<number>} P2 - The second control point of the Bézier curve, given as [x, y].
 * @param {Array<number>} P3 - The end point of the Bézier curve, given as [x, y].
 * @returns {Array<number>} A point on the Bézier curve at parameter t, given as [x, y].
 */
export function bezierPoint(t, p0, p1, p2, p3) {
  const u = 1 - t
  const tt = t * t
  const uu = u * u
  const uuu = uu * u
  const ttt = tt * t

  let p = [0, 0]
  p[0] = uuu * p0[0] //first term
  p[0] += 3 * uu * t * p1[0] //second term
  p[0] += 3 * u * tt * p2[0] //third term
  p[0] += ttt * p3[0] //fourth term

  p[1] = uuu * p0[1]
  p[1] += 3 * uu * t * p1[1]
  p[1] += 3 * u * tt * p2[1]
  p[1] += ttt * p3[1]

  return p
}

/**
 * Calculates the approximate length of a Bezier curve.
 *
 * @param {Array<Array<number>>} points - An array of points defining the Bezier curve.
 * @param {number} numSegments - The number of segments to divide the curve into for approximation.
 * @returns {number} The approximate length of the curve.
 */
export function getBezierLength(points, numSegments = 100) {
  let length = 0
  let prevPoint = points[0]

  for (let i = 1; i <= numSegments; i++) {
    const t = i / numSegments
    const currentPoint = bezierPoint(t, ...points)
    length += Math.sqrt((currentPoint[0] - prevPoint[0]) ** 2 + (currentPoint[1] - prevPoint[1]) ** 2)
    prevPoint = currentPoint
  }

  return length
}

/**
 * Shortens a Bezier curve by a given length.
 *
 * @param {Array<Array<number>>} points - An array of points defining the Bezier curve.
 * @param {number} shortenBy - The length by which to shorten the curve.
 * @param {number} numSegments - The number of segments to use in the approximation.
 * @returns {number} The t value where the curve should be cut.
 */
export function shortenCurve(points, shortenBy, numSegments = 1000) {
  const totalLength = getBezierLength(points, numSegments)
  const targetLength = totalLength - shortenBy
  let accumulatedLength = 0

  let prevPoint = points[0]
  let t = 0

  for (let i = 1; i <= numSegments; i++) {
    t = i / numSegments
    const currentPoint = bezierPoint(t, ...points)
    accumulatedLength += Math.sqrt((currentPoint[0] - prevPoint[0]) ** 2 + (currentPoint[1] - prevPoint[1]) ** 2)

    if (accumulatedLength >= targetLength) {
      break
    }

    prevPoint = currentPoint
  }

  return t
}

/**
 * Solves a Bezier curve for a given Y value, finding the corresponding X value.
 *
 * @param {Array<Array<number>>} curve - Array of points defining the Bezier curve.
 * @param {number} y - The Y value to solve for.
 * @returns {Object|null} The result containing 't' (parameter) and 'point' (coordinates), or null if no solution is found.
 */
export function solveBezierForX(curve, y) {
  const epsilon = 1e-6
  const maxIterations = 20
  let t = 0.5

  for (let i = 0; i < maxIterations; i++) {
    const [x, yValue] = bezierPoint(t, ...curve)

    if (Math.abs(yValue - y) < epsilon) {
      return { t, point: [x, y] }
    }

    const [, y1] = bezierPoint(t - epsilon, ...curve)
    const [, y2] = bezierPoint(t + epsilon, ...curve)
    const yDerivative = (y2 - y1) / (2 * epsilon)

    t -= (yValue - y) / yDerivative
  }

  return null
}

/**
 * Solves a Bezier curve for a given X value, finding the corresponding Y value.
 *
 * @param {Array<Array<number>>} curve - Array of points defining the Bezier curve.
 * @param {number} x - The X value to solve for.
 * @returns {Object|null} The result containing 't' (parameter) and 'point' (coordinates), or null if no solution is found.
 */
export function solveBezierForY(curve, x) {
  const epsilon = 1e-6
  const maxIterations = 20
  let t = 0.5

  for (let i = 0; i < maxIterations; i++) {
    const [xValue, y] = bezierPoint(t, ...curve)

    if (Math.abs(xValue - x) < epsilon) {
      return { t, point: [x, y] }
    }

    const [x1] = bezierPoint(t - epsilon, ...curve)
    const [x2] = bezierPoint(t + epsilon, ...curve)
    const xDerivative = (x2 - x1) / (2 * epsilon)

    t -= (xValue - x) / xDerivative
  }

  return null
}

/**
 * Determines if a point is on a cubic Bezier curve within a specified tolerance.
 *
 * @param {Array<Array<number>>} curvePoints - The points defining the Bezier curve.
 * @param {Array<number>} intersection - The point to check.
 * @param {number} tolerance - The tolerance for the proximity to the curve.
 * @returns {boolean} True if the point is on the curve within the tolerance, false otherwise.
 */
export function isPointOnCurve(curvePoints, intersection, tolerance = 1) {
  const [P0, P1, P2, P3] = curvePoints

  for (let t = 0; t <= 1; t += 0.001) {
    const [x, y] = bezierPoint(t, P0, P1, P2, P3)
    const distance = Math.sqrt((x - intersection[0]) ** 2 + (y - intersection[1]) ** 2)
    if (distance <= tolerance) {
      return true
    }
  }

  return false
}

/**
 * Mirrors a Bezier curve along a specified axis.
 *
 * @param {Array<Array<number>>} curve - The points defining the Bezier curve.
 * @param {number} axis - The axis value to mirror around.
 * @returns {Array<Array<number>>} The mirrored curve points.
 */
export function mirrorCurve(curve, axis) {
  return curve.map(point => {
    const [x, y] = point
    return [2 * axis - x, y]
  })
}

/**
 * Reverses an SVG path consisting of a move command followed by a cubic Bezier curve.
 *
 * @param {string} path - The SVG path string to reverse.
 * @returns {string} The reversed SVG path.
 */
export function reversePath(path) {
  // Extract the components of the path
  const [moveCommand, curveCommand] = path.split('C')
  const [moveX, moveY] = moveCommand.substring(1).split(',')
  const [control1X, control1Y, control2X, control2Y, endX, endY] = curveCommand.split(',')

  // Create the reversed path
  return `M${endX.trim()},${endY.trim()} C${control2X.trim()},${control2Y.trim()},${control1X.trim()},${control1Y.trim()},${moveX.trim()},${moveY.trim()}`
}
