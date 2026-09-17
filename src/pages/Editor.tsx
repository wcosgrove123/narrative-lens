import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, X, GripVertical, ImageIcon, Edit2 } from 'lucide-react';
import { useStoryStore } from '../stores/storyStore';
import { usePhotoStore } from '../stores/photoStore';
import { isSupportedImageFile } from '../utils/imageUtils';
import * as Dialog from '@radix-ui/react-dialog';
import { PhotoEditor } from '../components/PhotoEditor';
import { Button, IconButton } from '../components/ui/Button';
import type { FilterValues } from '../types/filters';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Photo } from '../types';
import { usePhotoUrl } from '../hooks/usePhotoUrl';

// Sortable Canvas Photo Component
function SortableCanvasPhoto({
  photo,
  onRemove,
  onSetCover,
  onEdit,
  isCover
}: {
  photo: Photo;
  onRemove: (id: string) => void;
  onSetCover: (id: string) => void;
  onEdit: (photo: Photo) => void;
  isCover: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: photo.id });

  const photoUrl = usePhotoUrl(photo.fullBlob || photo.fullDataUrl);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gray-800/50 rounded-lg overflow-hidden relative group"
    >
      {/* Drag Handle */}
      <div className="absolute top-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          {...attributes}
          {...listeners}
          className="p-2 rounded-lg cursor-grab active:cursor-grabbing"
          style={{
            backgroundColor: 'rgba(26, 26, 26, 0.9)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <GripVertical size={20} className="text-white" />
        </button>
      </div>

      {/* Edit Button */}
      <div className="absolute top-4 left-16 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <IconButton
          onClick={() => onEdit(photo)}
          icon={<Edit2 size={20} />}
          variant="ghost"
          size="sm"
          aria-label="Edit photo"
          style={{
            backgroundColor: 'rgba(26, 26, 26, 0.9)',
            backdropFilter: 'blur(8px)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#007AFF';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(26, 26, 26, 0.9)';
          }}
        />
      </div>

      {/* Set Cover Button */}
      <div className="absolute top-4 left-28 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <IconButton
          onClick={() => onSetCover(photo.id)}
          icon={<ImageIcon size={20} />}
          variant="ghost"
          size="sm"
          aria-label={isCover ? 'Current cover photo' : 'Set as cover photo'}
          style={{
            backgroundColor: isCover ? '#007AFF' : 'rgba(26, 26, 26, 0.9)',
            backdropFilter: 'blur(8px)',
          }}
          onMouseEnter={(e) => {
            if (!isCover) e.currentTarget.style.backgroundColor = '#007AFF';
          }}
          onMouseLeave={(e) => {
            if (!isCover) e.currentTarget.style.backgroundColor = 'rgba(26, 26, 26, 0.9)';
          }}
        />
      </div>

      {/* Remove Button */}
      <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <IconButton
          onClick={() => onRemove(photo.id)}
          icon={<X size={20} />}
          variant="ghost"
          size="sm"
          aria-label="Remove from canvas"
          style={{
            backgroundColor: 'rgba(26, 26, 26, 0.9)',
            backdropFilter: 'blur(8px)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#EF4444';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(26, 26, 26, 0.9)';
          }}
        />
      </div>

      {/* Cover Badge */}
      {isCover && (
        <div className="absolute top-4 left-16 bg-blue-600 px-3 py-1 rounded text-xs text-white font-semibold">
          Cover
        </div>
      )}

      {photoUrl && (
        <img
          src={photoUrl}
          alt={`Photo ${photo.sequence + 1}`}
          className="w-full h-auto"
        />
      )}
    </div>
  );
}

// Droppable Canvas Zone Component
function DroppableCanvas({ children }: { children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-drop-zone',
  });

  return (
    <div
      ref={setNodeRef}
      className={`max-w-4xl mx-auto transition-all ${isOver ? 'ring-2 ring-blue-500 rounded-lg' : ''}`}
    >
      {children}
    </div>
  );
}

// Drag Preview Component for DragOverlay
function DragPreview({ photo }: { photo: Photo }) {
  const thumbnailUrl = usePhotoUrl(photo.thumbnailBlob || photo.thumbnailDataUrl);

  return (
    <div className="bg-gray-800/90 rounded-lg overflow-hidden max-w-xs shadow-2xl">
      {thumbnailUrl && (
        <img
          src={thumbnailUrl}
          alt="Dragging"
          className="w-full h-auto"
        />
      )}
    </div>
  );
}

// Draggable Bin Photo Component
function DraggableBinPhoto({ photo }: { photo: Photo }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: photo.id });

  const thumbnailUrl = usePhotoUrl(photo.thumbnailBlob || photo.thumbnailDataUrl);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative aspect-square bg-gray-800 rounded overflow-hidden cursor-grab active:cursor-grabbing hover:ring-2 hover:ring-blue-500 transition-all group"
    >
      {thumbnailUrl && (
        <img
          src={thumbnailUrl}
          alt={photo.originalPath}
          className="w-full h-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <span className="text-white text-sm font-medium">Drag to canvas</span>
      </div>
    </div>
  );
}

export default function Editor() {
  const navigate = useNavigate();
  const { storyId } = useParams<{ storyId: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { getStoryById, updateStory } = useStoryStore();
  const { photos, loadPhotosForStory, addPhoto, updatePhotoSequence, deletePhoto } = usePhotoStore();

  const [storyTitle, setStoryTitle] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [canvasPhotos, setCanvasPhotos] = useState<Photo[]>([]);
  const [activePhoto, setActivePhoto] = useState<Photo | null>(null);

  // Photo editor modal state
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Get photo URL for editing
  const editingPhotoUrl = usePhotoUrl(editingPhoto?.fullBlob || editingPhoto?.fullDataUrl);

  // Configure drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  // Separate photos into canvas photos (sequence >= 0) and bin photos (sequence < 0)
  useEffect(() => {
    const canvas = photos.filter(p => p.sequence >= 0).sort((a, b) => a.sequence - b.sequence);
    setCanvasPhotos(canvas);
  }, [photos]);

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

  // Handle drag start for dnd-kit
  const handleDndDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const photo = photos.find(p => p.id === active.id);
    if (photo) {
      setActivePhoto(photo);
    }
  };

  // Handle drag end for dnd-kit
  const handleDndDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActivePhoto(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Handle adding photo from bin to canvas
    if (overId === 'canvas-drop-zone') {
      const photo = photos.find(p => p.id === activeId);
      if (photo && photo.sequence < 0) {
        // Photo is being added to canvas
        const updatedPhotos = [...canvasPhotos, { ...photo, sequence: canvasPhotos.length }];
        await updatePhotoSequence(updatedPhotos);
      }
      return;
    }

    // Handle reordering within canvas
    if (activeId !== overId) {
      const oldIndex = canvasPhotos.findIndex(p => p.id === activeId);
      const newIndex = canvasPhotos.findIndex(p => p.id === overId);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reordered = arrayMove(canvasPhotos, oldIndex, newIndex);
        const updatedPhotos = reordered.map((photo, index) => ({
          ...photo,
          sequence: index,
        }));
        await updatePhotoSequence(updatedPhotos);
      }
    }
  };

  // Remove photo from canvas (send back to bin with sequence = -1)
  const handleRemoveFromCanvas = async (photoId: string) => {
    const photo = photos.find(p => p.id === photoId);
    if (!photo) return;

    const remainingPhotos = canvasPhotos
      .filter(p => p.id !== photoId)
      .map((p, index) => ({ ...p, sequence: index }));

    await updatePhotoSequence([...remainingPhotos, { ...photo, sequence: -1 }]);
  };

  // Set cover image
  const handleSetCover = async (photoId: string) => {
    if (!storyId) return;
    await updateStory(storyId, { coverImageId: photoId });
  };

  // Open photo editor
  const handleEditPhoto = (photo: Photo) => {
    setEditingPhoto(photo);
    setIsEditorOpen(true);
  };

  // Save photo edits
  const handleSavePhotoEdits = async (filters: FilterValues) => {
    if (!editingPhoto) return;

    // TODO: Update photo in database with filter values
    // For now, just log them
    console.log('Saving filters for photo:', editingPhoto.id, filters);

    setIsEditorOpen(false);
    setEditingPhoto(null);
  };

  // Cancel photo editing
  const handleCancelPhotoEditing = () => {
    setIsEditorOpen(false);
    setEditingPhoto(null);
  };

  // Photos not in canvas (in the photo bin)
  const photosInBin = photos.filter(p => p.sequence < 0);

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
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDndDragStart}
      onDragEnd={handleDndDragEnd}
    >
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
      <header className="border-b border-gray-800 px-8 py-5 flex items-center justify-between">
        <Button
          onClick={() => navigate('/')}
          variant="ghost"
          leftIcon={<ArrowLeft size={20} />}
          size="base"
        >
          Back
        </Button>

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
        {/* Left Column - Canvas (70%) */}
        <div className="flex-[7] overflow-y-auto p-8">
          <DroppableCanvas>
            <SortableContext
              items={canvasPhotos.map(p => p.id)}
              strategy={verticalListSortingStrategy}
            >
              {canvasPhotos.length === 0 ? (
                <div className="text-center py-24 text-gray-500 border-2 border-dashed border-gray-700 rounded-lg">
                  <Upload size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">Drag photos here to build your story</p>
                  <p className="text-sm">Import photos from the panel on the right to get started</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {canvasPhotos.map((photo) => (
                    <SortableCanvasPhoto
                      key={photo.id}
                      photo={photo}
                      onRemove={handleRemoveFromCanvas}
                      onSetCover={handleSetCover}
                      onEdit={handleEditPhoto}
                      isCover={story?.coverImageId === photo.id}
                    />
                  ))}
                </div>
              )}
            </SortableContext>
          </DroppableCanvas>
        </div>

        {/* Right Column - Controls (30%) */}
        <div className="flex-[3] border-l border-gray-800 p-6 overflow-y-auto" style={{ backgroundColor: 'rgba(17, 24, 39, 0.3)' }}>
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
              <Button
                onClick={handleImportClick}
                variant="ghost"
                leftIcon={<Upload size={20} />}
                fullWidth
                style={{
                  height: 'auto',
                  padding: '2rem 1rem',
                  flexDirection: 'column',
                  color: isDragging ? '#007AFF' : '#737373',
                }}
              >
                <div className="text-center">
                  <div className="font-medium mb-1">
                    {isDragging ? 'Drop files here' : 'Import Photos'}
                  </div>
                  <div className="text-xs opacity-75">
                    {isDragging ? 'Release to import' : 'Click or drag files here'}
                  </div>
                </div>
              </Button>
            </div>

            {photosInBin.length > 0 && (
              <SortableContext
                items={photosInBin.map(p => p.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {photosInBin.map((photo) => (
                    <DraggableBinPhoto key={photo.id} photo={photo} />
                  ))}
                </div>
              </SortableContext>
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

    {/* Drag Overlay for visual feedback */}
    <DragOverlay>
      {activePhoto ? <DragPreview photo={activePhoto} /> : null}
    </DragOverlay>

    {/* Photo Editor Modal */}
    <Dialog.Root open={isEditorOpen} onOpenChange={setIsEditorOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 z-50" />
        <Dialog.Content className="fixed inset-0 z-50 overflow-hidden" aria-describedby="photo-editor-description">
          <Dialog.Title className="sr-only">Edit Photo</Dialog.Title>
          <Dialog.Description id="photo-editor-description" className="sr-only">
            Adjust brightness, contrast, saturation, and apply filters to your photo
          </Dialog.Description>
          {editingPhoto && editingPhotoUrl && (
            <PhotoEditor
              imageUrl={editingPhotoUrl}
              initialFilters={editingPhoto.edits}
              onSave={handleSavePhotoEdits}
              onCancel={handleCancelPhotoEditing}
            />
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  </DndContext>
  );
}
