import React, { useState } from 'react';
import { httpService } from '../../config/axios';

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
}

const CreatePlaylistForm: React.FC<Props> = ({ onSuccess, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cover, setCover] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const fd = new FormData();
    fd.append('title', title);
    if (description) fd.append('description', description);
    if (cover) fd.append('cover', cover);

    try {
      setLoading(true);
      await httpService.post('/playlists', fd);
      onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-white">
      <h2 className="text-lg font-bold">Create Playlist</h2>

      <div>
        <label className="block text-sm text-gray-300">
          Title <strong className="text-red-600">*</strong>
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md bg-[#0b1017] px-3 py-2 outline-none focus:ring-2 focus:ring-[#1574f5]"
          required
        />
      </div>

      <div>
        <label className="block text-sm text-gray-300">Cover</label>
        <input
          className="w-full cursor-pointer rounded-md bg-[#0b1017] px-3 py-2"
          type="file"
          accept="image/*"
          onChange={(e) => setCover(e.target.files?.[0] ?? null)}
        />
      </div>
      <div>
        <label className="block text-sm text-gray-300">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-md bg-[#0b1017] px-3 py-2 outline-none focus:ring-2 focus:ring-[#1574f5]"
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="cursor-pointer rounded-md bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="cursor-pointer rounded-md bg-[#1574f5] px-4 py-2 text-sm hover:brightness-110 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create'}
        </button>
      </div>
    </form>
  );
};

export default CreatePlaylistForm;
