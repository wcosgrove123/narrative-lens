import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { Button, IconButton } from './ui/Button';
import { Input } from './ui/Input';

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
            <Dialog.Close asChild>
              <IconButton
                icon={<X size={20} />}
                variant="ghost"
                size="sm"
                aria-label="Close dialog"
              />
            </Dialog.Close>
          </div>

          <Dialog.Description className="text-gray-400 text-sm mb-6">
            Give your photo story a memorable title to get started.
          </Dialog.Description>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <Input
                id="story-title"
                label="Story Title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Championship Game 2024"
                autoFocus
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Dialog.Close asChild>
                <Button
                  type="button"
                  variant="ghost"
                >
                  Cancel
                </Button>
              </Dialog.Close>
              <Button
                type="submit"
                disabled={!title.trim()}
              >
                Create Story
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
