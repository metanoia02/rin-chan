/**
 * Just returns a random element from an array
 * @param array Any array
 * @return Single element from input array
 */
export default function arrayRandom(array: any[]): (typeof array)[number] {
  return array[Math.floor(Math.random() * array.length)];
}
