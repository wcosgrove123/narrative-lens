import { useState } from 'react';
import { PhotoEditor } from '../components/PhotoEditor';
import type { FilterValues } from '../types/filters';

/**
 * Test page for the PhotoEditor component
 * Access at /test-editor
 */
export default function PhotoEditorTest() {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [testMode, setTestMode] = useState<'upload' | 'editor'>('upload');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setTestMode('editor');
    }
  };

  const handleSave = (filters: FilterValues) => {
    console.log('Saved filters:', filters);
    alert('Filters saved! Check console for values.');
  };

  const handleCancel = () => {
    setTestMode('upload');
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
      setImageUrl('');
    }
  };

  if (testMode === 'upload') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">
            Photo Editor Test
          </h1>
          <p className="text-gray-400 mb-8">
            Upload a photo to test the editing controls
          </p>
          <label className="inline-block px-8 py-4 bg-[#007AFF] text-white rounded-lg cursor-pointer hover:bg-[#0051D5] transition-colors">
            Choose Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen">
      <PhotoEditor
        imageUrl={imageUrl}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}
