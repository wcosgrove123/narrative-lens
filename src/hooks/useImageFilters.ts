import { useState, useCallback, useRef, useEffect } from 'react';
import type { FilterValues } from '../types/filters';
import {
  DEFAULT_FILTER_VALUES,
  applyFiltersToCanvas,
  applyPreset,
} from '../utils/imageFilters';

interface UseImageFiltersProps {
  imageUrl: string;
  initialFilters?: FilterValues;
}

export function useImageFilters({
  imageUrl,
  initialFilters = DEFAULT_FILTER_VALUES,
}: UseImageFiltersProps) {
  const [filters, setFilters] = useState<FilterValues>(initialFilters);
  const [isApplying, setIsApplying] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Apply filters whenever they change
  useEffect(() => {
    if (!canvasRef.current || !imageUrl) return;

    const applyFilters = async () => {
      setIsApplying(true);
      try {
        await applyFiltersToCanvas(canvasRef.current!, imageUrl, filters);
      } catch (error) {
        console.error('Failed to apply filters:', error);
      } finally {
        setIsApplying(false);
      }
    };

    applyFilters();
  }, [imageUrl, filters]);

  // Update individual filter value
  const updateFilter = useCallback(
    (key: keyof FilterValues, value: number) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  // Update all filters at once
  const setAllFilters = useCallback((newFilters: FilterValues) => {
    setFilters(newFilters);
  }, []);

  // Apply a preset
  const applyFilterPreset = useCallback((presetName: string) => {
    const presetValues = applyPreset(presetName);
    setFilters(presetValues);
  }, []);

  // Reset to defaults
  const reset = useCallback(() => {
    setFilters(DEFAULT_FILTER_VALUES);
  }, []);

  return {
    filters,
    updateFilter,
    setAllFilters,
    applyFilterPreset,
    reset,
    canvasRef,
    isApplying,
  };
}
