import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

interface CreateStoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateStory: (title: string) => void;
}

export default function CreateStoryDialog({ open, onOpenChange, onCreateStory }: CreateStoryDialogProps) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onCreateStory(title.trim());
      setTitle('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-xl p-6 shadow-2xl"
          style={{ backgroundColor: '#2A2A2A' }}
        >
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-2xl font-bold text-white">
              Create New Story
            </Dialog.Title>
            <Dialog.Close className="text-gray-400 hover:text-white transition-colors">
              <X size={24} />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="story-title" className="block text-sm font-medium text-gray-300 mb-2">
                Story Title
              </label>
              <input
                id="story-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Championship Game 2024"
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border-2 border-gray-700 focus:border-blue-500 outline-none transition-colors placeholder-gray-500"
                autoFocus
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="px-6 py-2.5 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors font-medium"
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={!title.trim()}
                className="px-6 py-2.5 rounded-lg text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600"
                style={{ backgroundColor: title.trim() ? '#007AFF' : '#666' }}
              >
                Create Story
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
