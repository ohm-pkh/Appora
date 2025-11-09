export function arrInArrCheck(arrA, arrB) {
  const setB = new Set(arrB)
  return arrA.some(x => setB.has(x))
}