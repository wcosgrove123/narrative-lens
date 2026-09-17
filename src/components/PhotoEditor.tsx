import { useImageFilters } from '../hooks/useImageFilters';
import type { FilterValues } from '../types/filters';
import { FILTER_PRESETS } from '../utils/imageFilters';
import { Button } from './ui/Button';

interface PhotoEditorProps {
  imageUrl: string;
  initialFilters?: FilterValues;
  onSave?: (filters: FilterValues) => void;
  onCancel?: () => void;
}

export function PhotoEditor({
  imageUrl,
  initialFilters,
  onSave,
  onCancel,
}: PhotoEditorProps) {
  const { filters, updateFilter, applyFilterPreset, reset, canvasRef, isApplying } =
    useImageFilters({
      imageUrl,
      initialFilters,
    });

  const handleSave = () => {
    if (onSave) {
      onSave(filters);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1A1A1A]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
        <h2 className="text-xl font-semibold text-white">Edit Photo</h2>
        <div className="flex gap-3">
          <Button
            onClick={reset}
            variant="ghost"
            size="sm"
          >
            Reset
          </Button>
          {onCancel && (
            <Button
              onClick={onCancel}
              variant="secondary"
              size="sm"
            >
              Cancel
            </Button>
          )}
          <Button
            onClick={handleSave}
            variant="primary"
            size="sm"
          >
            Save
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Preview Area */}
        <div className="flex-1 flex items-center justify-center p-8 bg-[#0D0D0D]">
          <div className="relative max-w-full max-h-full">
            {isApplying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                <div className="text-white text-sm">Applying filters...</div>
              </div>
            )}
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-full rounded-lg shadow-2xl"
              style={{ maxHeight: 'calc(100vh - 300px)' }}
            />
          </div>
        </div>

        {/* Controls Panel */}
        <div className="w-80 bg-[#1A1A1A] border-l border-gray-800 overflow-y-auto">
          {/* Filter Presets */}
          <div className="p-6 border-b border-gray-800">
            <h3 className="text-sm font-semibold text-white mb-4">Filters</h3>
            <div className="grid grid-cols-2 gap-2">
              {FILTER_PRESETS.map((preset) => (
                <Button
                  key={preset.name}
                  onClick={() => applyFilterPreset(preset.name)}
                  variant="secondary"
                  size="sm"
                  fullWidth
                  style={{
                    fontSize: '0.8125rem',
                  }}
                >
                  {preset.displayName}
                </Button>
              ))}
            </div>
          </div>

          {/* Adjustment Sliders */}
          <div className="p-6 space-y-6">
            <h3 className="text-sm font-semibold text-white mb-4">Adjustments</h3>

            {/* Brightness */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm text-gray-400">Brightness</label>
                <span className="text-sm text-gray-300">{filters.brightness}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                value={filters.brightness}
                onChange={(e) => updateFilter('brightness', Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            {/* Contrast */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm text-gray-400">Contrast</label>
                <span className="text-sm text-gray-300">{filters.contrast}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                value={filters.contrast}
                onChange={(e) => updateFilter('contrast', Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            {/* Saturation */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm text-gray-400">Saturation</label>
                <span className="text-sm text-gray-300">{filters.saturation}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                value={filters.saturation}
                onChange={(e) => updateFilter('saturation', Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            {/* Blur */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm text-gray-400">Blur</label>
                <span className="text-sm text-gray-300">{filters.blur}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={filters.blur}
                onChange={(e) => updateFilter('blur', Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
