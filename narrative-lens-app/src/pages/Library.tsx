import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useStoryStore } from '../stores/storyStore';
import CreateStoryDialog from '../components/CreateStoryDialog';

export default function Library() {
  const navigate = useNavigate();
  const { stories, loadStories, createStory } = useStoryStore();
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    loadStories();
  }, [loadStories]);

  const handleCreateStory = async (title: string) => {
    const newStory = await createStory(title);
    navigate(`/editor/${newStory.id}`);
  };

  const hasStories = stories.length > 0;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1A1A1A' }}>
      {/* Header */}
      <header className="border-b border-gray-800 px-8 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Visual Narrative</h1>
          <button
            onClick={() => setDialogOpen(true)}
            className="flex items-center gap-2 rounded-lg px-6 py-3 text-white font-medium hover:bg-blue-600 transition-colors"
            style={{ backgroundColor: '#007AFF' }}
          >
            <Plus size={20} />
            New Story
          </button>
        </div>
      </header>

      {/* Story Grid / Welcome Screen */}
      <main className="px-8 py-12 flex-1">
        {hasStories ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {stories.map((story) => (
              <div
                key={story.id}
                onClick={() => navigate(`/editor/${story.id}`)}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[4/3] bg-gray-800 rounded-lg overflow-hidden mb-3 hover:ring-2 hover:ring-blue-500 transition-all">
                  {story.coverImageId ? (
                    <img
                      src={`/placeholder-cover.jpg`}
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-white font-medium truncate">{story.title}</h3>
                <p className="text-sm text-gray-500">{new Date(story.updatedAt).toLocaleDateString()}</p>
              </div>
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
                <button
                  onClick={() => setDialogOpen(true)}
                  className="inline-flex items-center gap-3 rounded-lg px-8 py-4 text-lg text-white font-semibold hover:bg-blue-600 transition-all transform hover:scale-105 shadow-lg"
                  style={{ backgroundColor: '#007AFF' }}
                >
                  <Plus size={24} />
                  Create Your First Story
                </button>

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
    </div>
  );
}
