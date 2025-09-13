import React, { useState } from 'react';
import { httpService } from '../../config/axios';
import { Playlistinfo } from '../../services/playlistDetailsService';
import { useDeletePlaylist } from '../../hooks/useDeletePlaylist';
import ConfirmDialog from '../MyPlayLists/ConfirmDialog';

interface Props {
  playlist: Playlistinfo;
  onCancel: () => void;
  onSuccess: () => void;
  onDeleted?: () => void;
}

const EditPlaylistForm: React.FC<Props> = ({
  playlist,
  onCancel,
  onSuccess,
  onDeleted,
}) => {
  const [title, setTitle] = useState<string>(playlist.title);
  const [description, setDescription] = useState<string>(
    playlist.description ?? ''
  );
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { mutate: deletePlaylist, isPending: isDeleting } = useDeletePlaylist();

  const hasTitleChanged = title.trim() !== (playlist.title ?? '').trim();
  const hasDescriptionChanged =
    description.trim() !== (playlist.description ?? '').trim();
  const hasCover = !!coverFile;

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setCoverFile(f);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    if (!hasTitleChanged && !hasDescriptionChanged && !hasCover) {
      setError('Please change at least one field.');
      return;
    }

    const fd = new FormData();

    if (hasTitleChanged) fd.append('title', title.trim());
    if (hasDescriptionChanged) fd.append('description', description.trim());
    if (hasCover && coverFile) fd.append('cover', coverFile);

    try {
      setLoading(true);

      await httpService.patch(`/playlists/${playlist.id}`, fd);
      onSuccess();
    } catch (err: any) {
      console.error('Update playlist error:', err);
      const msg =
        err?.response?.data?.message || err?.message || 'update error';
      setError(String(msg));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    deletePlaylist(playlist.id, {
      onSuccess: () => {
        setDeleteOpen(false);
        if (onDeleted) onDeleted();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-white">
      <h2 className="text-lg font-semibold">Edit playlist</h2>

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
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="w-full cursor-pointer rounded-md bg-[#0b1017] px-3 py-2"
        />
        {coverFile && (
          <div className="mt-2 text-sm text-gray-300">
            File: {coverFile.name}
          </div>
        )}
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

      {error && <div className="text-sm text-rose-400">{error}</div>}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setDeleteOpen(true)}
          className="rounded-md bg-red-600/20 px-4 py-2 text-red-400 hover:bg-red-600/30"
        >
          Delete Playlist
        </button>
        
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md bg-white/10 px-4 py-2 hover:bg-white/20"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-[#1574f5] px-4 py-2 text-white disabled:opacity-60"
          >
            {loading ? 'Updating...' : 'Update'}
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete this playlist?"
        description={`"${playlist.title}" will be permanently deleted.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </form>
  );
};

export default EditPlaylistForm;
