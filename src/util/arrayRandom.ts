/**
 * Just returns a random element from an array
 * @param {Array} array
 * @return {any} Single element from input array
 */
export default function arrayRandom(array: any[]) {
  return array[Math.floor(Math.random() * array.length)];
}
