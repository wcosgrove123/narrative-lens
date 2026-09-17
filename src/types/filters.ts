// Filter-related type definitions

export interface FilterValues {
  brightness: number; // 0-200 (100 = normal)
  contrast: number; // 0-200 (100 = normal)
  saturation: number; // 0-200 (100 = normal)
  blur: number; // 0+ pixels
}

export interface FilterPreset {
  name: string;
  displayName: string;
  values: FilterValues;
}
