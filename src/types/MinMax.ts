export type MinMax = {
  max: number;
  min: number;
};

export function isMinMax(value: MinMax | number): value is MinMax {
  return (value as MinMax).min !== undefined;
}
