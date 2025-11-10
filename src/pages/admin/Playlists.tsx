import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { httpService } from '../../config/axios';

type PlaylistRow = {
  id: number;
  title: string;
  slug: string;
  description?: string;
  cover?: string;
  status: 'public' | 'private';
  ownerId: number;
  createdAt?: string;
};

type PlaylistsResponse = {
  playlists: PlaylistRow[];
  pagination: { page: number; limit: number; pageCount: number; totalCount: number };
};

const Playlists = () => {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<'all' | 'public' | 'private'>('all');

  const { data, isLoading, isFetching } = useQuery<PlaylistsResponse>({
    queryKey: ['admin-playlists', page, limit, q, status],
    queryFn: async () => {
      const { data } = await httpService.get<PlaylistsResponse>('/admin/playlists', {
        params: { page, limit, q: q || undefined, status: status === 'all' ? undefined : status },
      });
      return data;
    },
    retry: 1,
  });

  const playlists = data?.playlists || [];
  const pagination = data?.pagination;

  const toggleStatusMutation = useMutation({
    mutationFn: async (pl: PlaylistRow) => {
      const next = pl.status === 'public' ? 'private' : 'public';
      await httpService.patch(`/admin/playlists/${pl.id}/status`, { status: next });
      return { id: pl.id, status: next };
    },
    onMutate: async (pl) => {
      await qc.cancelQueries({ queryKey: ['admin-playlists'] });
      const prev = qc.getQueriesData<PlaylistsResponse>({ queryKey: ['admin-playlists'] });
      qc.setQueriesData<PlaylistsResponse>({ queryKey: ['admin-playlists'] }, (old) => {
        if (!old) return old as any;
        const next = pl.status === 'public' ? 'private' : 'public';
        return {
          ...old,
          playlists: old.playlists.map((p) => (p.id === pl.id ? { ...p, status: next } : p)),
        } as PlaylistsResponse;
      });
      return { prev };
    },
    onError: (_e, _pl, ctx) => {
      ctx?.prev?.forEach(([key, snapshot]) => qc.setQueryData(key as any, snapshot));
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['admin-playlists'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (pl: PlaylistRow) => {
      await httpService.delete(`/admin/playlists/${pl.id}`);
      return { id: pl.id };
    },
    onMutate: async (pl) => {
      await qc.cancelQueries({ queryKey: ['admin-playlists'] });
      const prev = qc.getQueriesData<PlaylistsResponse>({ queryKey: ['admin-playlists'] });
      qc.setQueriesData<PlaylistsResponse>({ queryKey: ['admin-playlists'] }, (old) => {
        if (!old) return old as any;
        return { ...old, playlists: old.playlists.filter((p) => p.id !== pl.id) } as PlaylistsResponse;
      });
      return { prev };
    },
    onError: (_e, _pl, ctx) => {
      ctx?.prev?.forEach(([key, snapshot]) => qc.setQueryData(key as any, snapshot));
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['admin-playlists'] }),
  });

  const canPrev = useMemo(() => (pagination ? page > 1 : false), [pagination, page]);
  const canNext = useMemo(
    () => (pagination ? page < pagination.pageCount : false),
    [pagination, page]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-bold">Playlists</h2>
        {isFetching && <span className="text-xs text-white/50">Updating…</span>}
      </div>

      <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <input
            value={q}
            onChange={(e) => {
              setPage(1);
              setQ(e.target.value);
            }}
            type="text"
            placeholder="Search by title/slug"
            className="w-full sm:w-80 rounded-lg bg-white/5 placeholder-white/40 focus:bg-white/10 border border-white/10 focus:border-white/20 outline-none px-3 py-2 text-sm"
          />
          <select
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value as any);
            }}
            className="w-full sm:w-44 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm"
          >
            <option value="all">All statuses</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>

        <div className="flex items-center gap-2 text-sm text-white/60">
          <span>Total:</span>
          <strong className="text-white">{pagination?.totalCount ?? '—'}</strong>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="min-w-full text-sm">
          <thead className="bg-white/5 text-white/70">
            <tr>
              <th className="px-4 py-3 text-right">Title</th>
              <th className="px-4 py-3 text-right">Status</th>
              <th className="px-4 py-3 text-right">Owner</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-t border-white/5">
                  <td className="px-4 py-3" colSpan={4}>
                    <div className="h-6 bg-white/5 animate-pulse rounded" />
                  </td>
                </tr>
              ))
            ) : playlists.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-center text-white/60" colSpan={4}>
                  No results found
                </td>
              </tr>
            ) : (
              playlists.map((pl) => (
                <tr key={pl.id} className="border-t border-white/5">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {pl.cover && (
                        <img src={pl.cover} alt={pl.title} className="w-10 h-10 rounded object-cover" />
                      )}
                      <div className="flex flex-col">
                        <span className="font-semibold">{pl.title}</span>
                        <span className="text-white/60 text-xs">/{pl.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded text-xs border border-white/10 bg-white/5">
                      {pl.status === 'public' ? 'Public' : 'Private'}
                    </span>
                  </td>
                  <td className="px-4 py-3">#{pl.ownerId}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => toggleStatusMutation.mutate(pl)}
                        className="px-3 py-1.5 rounded-lg text-xs border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10"
                      >
                        {pl.status === 'public' ? 'Make Private' : 'Make Public'}
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate(pl)}
                        className="px-3 py-1.5 rounded-lg text-xs border border-red-500/30 text-red-300 hover:border-red-500/60 bg-red-500/10 hover:bg-red-500/20"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs text-white/60">
          Page {pagination?.page ?? page} of {pagination?.pageCount ?? '—'}
        </div>
        <div className="flex items-center gap-2">
          <button
            disabled={!canPrev}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1.5 rounded-lg text-sm border border-white/10 disabled:opacity-40 disabled:cursor-not-allowed hover:border-white/20 bg-white/5 hover:bg-white/10"
          >
            Prev
          </button>
          <button
            disabled={!canNext}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1.5 rounded-lg text-sm border border-white/10 disabled:opacity-40 disabled:cursor-not-allowed hover:border-white/20 bg-white/5 hover:bg-white/10"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Playlists;


