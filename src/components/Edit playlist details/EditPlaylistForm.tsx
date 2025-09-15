import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { httpService } from '../../config/axios';
import { Playlistinfo } from '../../services/playlistDetailsService';
import { useDeletePlaylist } from '../../hooks/useDeletePlaylist';
import ConfirmDialog from '../MyPlayLists/ConfirmDialog';
import { MdDelete } from 'react-icons/md';

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
  const [isDeleting, setIsDeleting] = useState(false);
  const { mutate: deletePlaylist, isPending: isDeletingMutation } = useDeletePlaylist();
  const navigate = useNavigate();

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
    setIsDeleting(true);
    deletePlaylist(playlist.id, {
      onSuccess: () => {
        setDeleteOpen(false);
        setIsDeleting(false);
        if (onDeleted) onDeleted();
        // Redirect to profile page after successful deletion
        navigate('/profile');
      },
      onError: () => {
        setIsDeleting(false);
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

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-6">
        {/* Right side on desktop; first on mobile */}
        <div className="order-1 sm:order-2 flex w-full sm:w-auto flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto rounded-lg border border-white/20 bg-white/5 px-5 py-3 text-white text-base font-medium transition-all duration-200 hover:bg-white/10 hover:border-white/30 hover:shadow-md"
          >
            انصراف
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto rounded-lg bg-gradient-to-r from-[#1574f5] to-[#0ea5e9] px-6 py-3 text-white text-base font-medium transition-all duration-300 hover:from-[#0ea5e9] hover:to-[#1574f5] hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                در حال به‌روزرسانی...
              </div>
            ) : (
              'به‌روزرسانی'
            )}
          </button>
        </div>

        {/* Delete button - last on mobile; left on desktop */}
        <button
          type="button"
          onClick={() => setDeleteOpen(true)}
          className="order-2 sm:order-1 group relative flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-5 py-3 text-red-400 text-base font-medium transition-all duration-300 hover:border-red-500/60 hover:bg-red-500/20 hover:text-red-300 hover:shadow-md hover:shadow-red-500/25"
        >
          <MdDelete className="h-5 w-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
          <span>حذف پلی‌لیست</span>
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
        </button>
      </div>


      <ConfirmDialog
        open={deleteOpen}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting || isDeletingMutation}
        title="حذف این پلی‌لیست؟"
        description={`"${playlist.title}" به طور کامل حذف خواهد شد. این عمل قابل بازگشت نیست.`}
        confirmText={isDeleting || isDeletingMutation ? "در حال حذف..." : "حذف"}
        cancelText="انصراف"
      />
    </form>
  );
};

export default EditPlaylistForm;
