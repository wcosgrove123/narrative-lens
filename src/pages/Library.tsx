import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import { useStoryStore } from '../stores/storyStore';
import CreateStoryDialog from '../components/CreateStoryDialog';
import { Button, IconButton } from '../components/ui/Button';
import * as Dialog from '@radix-ui/react-dialog';
import { db } from '../db';
import type { Photo } from '../types';
import { usePhotoUrl } from '../hooks/usePhotoUrl';

// Component to display story card with cover image
function StoryCard({ story, onNavigate, onDelete }: { story: any; onNavigate: () => void; onDelete: () => void }) {
  const [coverPhoto, setCoverPhoto] = useState<Photo | null>(null);
  const coverUrl = usePhotoUrl(coverPhoto?.thumbnailBlob || coverPhoto?.thumbnailDataUrl);

  useEffect(() => {
    async function loadCoverPhoto() {
      if (story.coverImageId) {
        const photo = await db.photos.get(story.coverImageId);
        if (photo) {
          setCoverPhoto(photo);
        }
      }
    }
    loadCoverPhoto();
  }, [story.coverImageId]);

  return (
    <div className="group">
      <div
        onClick={onNavigate}
        className="cursor-pointer relative rounded-xl overflow-hidden transition-all duration-300 ease-out"
        style={{
          aspectRatio: '3 / 2',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.4)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
          e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5), 0 0 0 3px rgba(0, 122, 255, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.4)';
        }}
      >
        {/* Background Image */}
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={story.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-600">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        )}

        {/* Gradient Overlay - Always visible */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.7) 40%, transparent 70%)',
          }}
        />

        {/* Title - Centered at bottom */}
        <div className="absolute inset-x-0 bottom-0 p-6 flex items-end justify-center">
          <h3
            className="text-white text-center leading-tight"
            style={{
              fontWeight: 700,
              fontSize: '1.5rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {story.title}
          </h3>
        </div>

        {/* Delete Button */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10">
          <IconButton
            icon={<Trash2 size={18} />}
            variant="ghost"
            size="sm"
            aria-label="Delete story"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
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
      </div>
    </div>
  );
}

export default function Library() {
  const navigate = useNavigate();
  const { stories, loadStories, createStory, deleteStory } = useStoryStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    loadStories();
  }, [loadStories]);

  const handleCreateStory = async (title: string) => {
    const newStory = await createStory(title);
    navigate(`/editor/${newStory.id}`);
  };

  const handleDeleteStory = async (id: string) => {
    await deleteStory(id);
    setDeleteConfirmId(null);
  };

  const hasStories = stories.length > 0;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1A1A1A' }}>
      {/* Header */}
      <header className="border-b border-gray-800 px-8 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Visual Narrative</h1>
          <Button
            onClick={() => setDialogOpen(true)}
            leftIcon={<Plus size={20} />}
            size="lg"
          >
            New Story
          </Button>
        </div>
      </header>

      {/* Story Grid / Welcome Screen */}
      <main className="px-8 py-12 flex-1">
        {hasStories ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {stories.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                onNavigate={() => navigate(`/editor/${story.id}`)}
                onDelete={() => setDeleteConfirmId(story.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <div className="max-w-2xl mx-auto text-center">
              {/* Empty state - Welcome */}
              <div className="mb-12">
                <div className="mb-6">
                  <svg
                    className="mx-auto mb-8"
                    width="120"
                    height="120"
                    viewBox="0 0 120 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect x="20" y="25" width="35" height="45" rx="4" fill="#374151" opacity="0.6" />
                    <rect x="65" y="25" width="35" height="45" rx="4" fill="#374151" opacity="0.8" />
                    <rect x="20" y="50" width="35" height="45" rx="4" fill="#374151" opacity="0.8" />
                    <rect x="65" y="50" width="35" height="45" rx="4" fill="#007AFF" opacity="0.9" />
                  </svg>
                </div>

                <h2 className="text-4xl font-bold text-white mb-4">
                  Welcome to Visual Narrative
                </h2>
                <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                  Create compelling photo stories that capture moments,<br />
                  emotions, and the narrative arc of your experiences.
                </p>
              </div>

              {/* Call to Action */}
              <div className="space-y-6">
                <Button
                  onClick={() => setDialogOpen(true)}
                  leftIcon={<Plus size={24} />}
                  size="lg"
                  style={{
                    fontSize: '1.125rem',
                    padding: '1rem 2rem',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                  }}
                >
                  Create Your First Story
                </Button>

                <p className="text-sm text-gray-500">
                  Import photos, arrange them in sequence, and tell your story
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="mt-16 grid grid-cols-3 gap-8 text-left">
                <div>
                  <div className="w-12 h-12 rounded-lg mb-3 flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 122, 255, 0.1)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="M21 15l-5-5L5 21" />
                    </svg>
                  </div>
                  <h3 className="text-white font-semibold mb-1">Import & Organize</h3>
                  <p className="text-sm text-gray-500">Easily import and sequence your photos</p>
                </div>

                <div>
                  <div className="w-12 h-12 rounded-lg mb-3 flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 122, 255, 0.1)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2">
                      <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                  </div>
                  <h3 className="text-white font-semibold mb-1">Tell Your Story</h3>
                  <p className="text-sm text-gray-500">Arrange photos to create narrative flow</p>
                </div>

                <div>
                  <div className="w-12 h-12 rounded-lg mb-3 flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 122, 255, 0.1)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                    </svg>
                  </div>
                  <h3 className="text-white font-semibold mb-1">Save & Revisit</h3>
                  <p className="text-sm text-gray-500">Your stories are saved locally</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 w-full text-center py-4 text-gray-500 text-sm">
        <a
          href="#"
          className="hover:text-blue-500 transition-colors"
        >
          View My Public Portfolio
        </a>
      </footer>

      <CreateStoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreateStory={handleCreateStory}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog.Root open={deleteConfirmId !== null} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900 rounded-xl p-8 max-w-md w-full shadow-2xl border border-gray-800 z-50">
            <Dialog.Title className="text-2xl font-bold text-white mb-3">
              Delete Story?
            </Dialog.Title>
            <Dialog.Description className="text-gray-400 mb-8">
              This will permanently delete this story and all its photos. This action cannot be undone.
            </Dialog.Description>

            <div className="flex gap-3 justify-end">
              <Button
                onClick={() => setDeleteConfirmId(null)}
                variant="secondary"
              >
                Cancel
              </Button>
              <Button
                onClick={() => deleteConfirmId && handleDeleteStory(deleteConfirmId)}
                variant="danger"
              >
                Delete
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
