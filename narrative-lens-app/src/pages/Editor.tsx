import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload } from 'lucide-react';
import { useStoryStore } from '../stores/storyStore';
import { usePhotoStore } from '../stores/photoStore';
import { isSupportedImageFile } from '../utils/imageUtils';

export default function Editor() {
  const navigate = useNavigate();
  const { storyId } = useParams<{ storyId: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { getStoryById, updateStory } = useStoryStore();
  const { photos, loadPhotosForStory, addPhoto } = usePhotoStore();

  const [storyTitle, setStoryTitle] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const story = storyId ? getStoryById(storyId) : undefined;

  useEffect(() => {
    if (storyId) {
      loadPhotosForStory(storyId);
    }
  }, [storyId, loadPhotosForStory]);

  useEffect(() => {
    if (story) {
      setStoryTitle(story.title);
      setIsPublished(story.isPublished || false);
    }
  }, [story]);

  // Prevent browser from opening dropped files outside drop zones
  useEffect(() => {
    const preventDefaults = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    // Add global drag event listeners to prevent browser default behavior
    window.addEventListener('dragover', preventDefaults);
    window.addEventListener('drop', preventDefaults);

    return () => {
      window.removeEventListener('dragover', preventDefaults);
      window.removeEventListener('drop', preventDefaults);
    };
  }, []);

  const handleTitleChange = async (newTitle: string) => {
    setStoryTitle(newTitle);
    if (storyId && newTitle.trim()) {
      await updateStory(storyId, { title: newTitle.trim() });
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !storyId) return;

    // Import all selected files
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        await addPhoto(storyId, file);
      }
    }

    // Reset input
    e.target.value = '';
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (!storyId) return;

    const files = Array.from(e.dataTransfer.files);
    console.log('Dropped files:', files.length);

    for (const file of files) {
      // Use isSupportedImageFile to handle HEIC and other formats properly
      if (isSupportedImageFile(file)) {
        console.log('Importing:', file.name);
        try {
          await addPhoto(storyId, file);
        } catch (error) {
          console.error('Failed to import photo:', error);
          // Could add user-facing error notification here in future
        }
      } else {
        console.warn('Unsupported file type:', file.name, file.type);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  // Photos not in canvas (in the photo bin)
  // const photosInBin = photos.filter(p => p.sequence === -1 || true); // For now, show all photos in bin
  const photosInCanvas: typeof photos = []; // Will implement sequencing next

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1A1A1A' }}>
        <div className="text-center">
          <p className="text-gray-400 text-lg">Story not found</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 text-blue-500 hover:text-blue-400"
          >
            Return to Library
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{ backgroundColor: '#1A1A1A' }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
    >
      {/* Drag Overlay */}
      {isDragging && (
        <div className="fixed inset-0 bg-blue-500/20 border-4 border-blue-500 border-dashed z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-gray-900/90 px-8 py-6 rounded-lg border-2 border-blue-500">
            <Upload size={48} className="mx-auto mb-4 text-blue-500" />
            <p className="text-white text-2xl font-semibold">Drop photos to import</p>
            <p className="text-gray-400 text-sm mt-2">HEIC, JPEG, PNG, and more supported</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-gray-800 px-8 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <input
          type="text"
          value={storyTitle}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Story Title"
          className="bg-transparent text-xl font-bold text-white text-center outline-none border-b-2 border-transparent hover:border-gray-700 transition-colors px-4 py-2"
          style={{ borderBottomColor: 'transparent' }}
          onFocus={(e) => e.target.style.borderBottomColor = '#007AFF'}
          onBlur={(e) => e.target.style.borderBottomColor = 'transparent'}
        />

        <div className="flex items-center gap-4">
          <span className="text-gray-500 text-sm">Publish</span>
          <button
            onClick={() => setIsPublished(!isPublished)}
            className="w-12 h-6 rounded-full relative transition-colors"
            style={{ backgroundColor: isPublished ? '#007AFF' : '#4B5563' }}
          >
            <span
              className="absolute top-1 w-4 h-4 bg-white rounded-full transition-transform"
              style={{ left: isPublished ? 'calc(100% - 20px)' : '4px' }}
            ></span>
          </button>
        </div>
      </header>

      {/* Main Content - Two Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column - Canvas */}
        <div className="flex-[3] overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto">
            {photosInCanvas.length === 0 ? (
              <div className="text-center py-24 text-gray-500 border-2 border-dashed border-gray-700 rounded-lg">
                <Upload size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">Drag photos here to build your story</p>
                <p className="text-sm">Import photos from the panel on the right to get started</p>
              </div>
            ) : (
              <div className="space-y-6">
                {photosInCanvas.map((photo) => (
                  <div
                    key={photo.id}
                    className="bg-gray-800/50 rounded-lg overflow-hidden"
                  >
                    <img
                      src={photo.fullDataUrl}
                      alt={`Photo ${photo.sequence + 1}`}
                      className="w-full h-auto"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Controls */}
        <div className="flex-1 border-l border-gray-800 p-6 overflow-y-auto" style={{ backgroundColor: 'rgba(17, 24, 39, 0.3)' }}>
          {/* Photo Bin */}
          <section className="mb-8">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Photo Bin
            </h3>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              className={`w-full border-2 border-dashed rounded-lg transition-all ${
                isDragging
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-700'
              }`}
            >
              <button
                onClick={handleImportClick}
                className="w-full flex items-center justify-center gap-2 py-8 text-gray-500 hover:text-blue-500 transition-colors"
              >
                <Upload size={20} />
                <div className="text-center">
                  <div className={isDragging ? 'text-blue-500' : ''}>
                    {isDragging ? 'Drop files here' : 'Import Photos'}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {isDragging ? 'Release to import' : 'Click or drag files here'}
                  </div>
                </div>
              </button>
            </div>

            {photos.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-4">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative aspect-square bg-gray-800 rounded overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all group"
                  >
                    <img
                      src={photo.thumbnailDataUrl || photo.fullDataUrl}
                      alt={`Photo ${photo.sequence + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-sm font-medium">Drag to canvas</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {photos.length > 0 && (
              <p className="text-xs text-gray-600 mt-3 text-center">
                {photos.length} photo{photos.length !== 1 ? 's' : ''} imported
              </p>
            )}
          </section>

          {/* Tone Editor */}
          <section>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Tone Editor
            </h3>
            <p className="text-sm text-gray-600">Select a photo to edit</p>
            <p className="text-xs text-gray-700 mt-2">Coming in v1.1</p>
          </section>
        </div>
      </div>
    </div>
  );
}
