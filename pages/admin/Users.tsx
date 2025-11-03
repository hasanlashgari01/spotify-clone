import { useMemo, useState, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { httpService } from '../../config/axios';

type UserRow = {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: string;
  isBan: boolean;
  createdAt?: string;
};

type UsersResponse = {
  users: UserRow[];
  pagination: { page: number; limit: number; pageCount: number; totalCount: number };
};

const Users = () => {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [q, setQ] = useState('');

  // Query for fetching users
  const { data, isLoading, isFetching } = useQuery<UsersResponse>({
    queryKey: ['admin-users', page, limit, q],
    queryFn: async () => {
      const { data } = await httpService.get<UsersResponse>('/admin/users', {
        params: { page, limit, q: q || undefined },
      });
      return data;
    },
    retry: 1,
  });

  const users = data?.users || [];
  const pagination = data?.pagination;

  // Ban/Unban Mutation
  const banMutation = useMutation({
    mutationFn: async (user: UserRow) => {
      const url = user.isBan ? `/admin/users/${user.id}/unban` : `/admin/users/${user.id}/ban`;
      await httpService.patch(url);
      return { id: user.id };
    },
    onMutate: async (user: UserRow) => {
      await qc.cancelQueries({ queryKey: ['admin-users'] });
      const previousData = qc.getQueriesData<UsersResponse>({ queryKey: ['admin-users'] });
      qc.setQueriesData<UsersResponse>({ queryKey: ['admin-users'] }, (oldData) => {
        if (!oldData) return oldData as any;
        return {
          ...oldData,
          users: oldData.users.map((u) => (u.id === user.id ? { ...u, isBan: !u.isBan } : u)),
        } as UsersResponse;
      });
      return { previousData };
    },
    onError: (_e, _user, context) => {
      context?.previousData?.forEach(([key, snapshot]) => {
        qc.setQueryData(key as any, snapshot);
      });
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  // Role change Mutation
  const roleMutation = useMutation({
    mutationFn: async (user: UserRow) => {
      const nextRole = user.role.toLowerCase() === 'admin' ? 'user' : 'admin';
      await httpService.patch(`/admin/users/${user.id}/role`, { role: nextRole });
      return { id: user.id, role: nextRole };
    },
    onMutate: async (user: UserRow) => {
      await qc.cancelQueries({ queryKey: ['admin-users'] });
      const previousData = qc.getQueriesData<UsersResponse>({ queryKey: ['admin-users'] });
      qc.setQueriesData<UsersResponse>({ queryKey: ['admin-users'] }, (oldData) => {
        if (!oldData) return oldData as any;
        const nextRole = user.role.toLowerCase() === 'admin' ? 'user' : 'admin';
        return {
          ...oldData,
          users: oldData.users.map((u) => (u.id === user.id ? { ...u, role: nextRole } : u)),
        } as UsersResponse;
      });
      return { previousData };
    },
    onError: (_e, _user, context) => {
      context?.previousData?.forEach(([key, snapshot]) => {
        qc.setQueryData(key as any, snapshot);
      });
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  const canPrev = useMemo(() => (pagination ? page > 1 : false), [pagination, page]);
  const canNext = useMemo(
    () => (pagination ? page < pagination.pageCount : false),
    [pagination, page]
  );

  // Callback to handle page change
  const handlePageChange = useCallback(
    (direction: 'next' | 'prev') => {
      setPage((prevPage) => {
        if (direction === 'next') return Math.min(prevPage + 1, pagination?.pageCount ?? prevPage);
        if (direction === 'prev') return Math.max(prevPage - 1, 1);
        return prevPage;
      });
    },
    [pagination]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-bold">Users</h2>
        {isFetching && <span className="text-xs text-white/50">Updating…</span>}
      </div>

      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <input
          value={q}
          onChange={(e) => {
            setPage(1);
            setQ(e.target.value);
          }}
          type="text"
          placeholder="Search by username/email"
          className="w-full md:w-80 rounded-lg bg-white/5 placeholder-white/40 focus:bg-white/10 border border-white/10 focus:border-white/20 outline-none px-3 py-2 text-sm"
        />
        <div className="flex items-center gap-2 text-sm text-white/60">
          <span>Total:</span>
          <strong className="text-white">{pagination?.totalCount ?? '—'}</strong>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="min-w-full text-sm">
          <thead className="bg-white/5 text-white/70">
            <tr>
              <th className="px-4 py-3 text-right">User</th>
              <th className="px-4 py-3 text-right">Email</th>
              <th className="px-4 py-3 text-right">Role</th>
              <th className="px-4 py-3 text-right">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-t border-white/5">
                  <td className="px-4 py-3" colSpan={5}>
                    <div className="h-6 bg-white/5 animate-pulse rounded" />
                  </td>
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-center text-white/60" colSpan={5}>
                  No results found
                </td>
              </tr>
            ) : (
              users.map((user: UserRow) => (
                <tr key={user.id} className="border-t border-white/5">
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-semibold">{user.fullName || user.username}</span>
                      <span className="text-white/60 text-xs">@{user.username}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded text-xs border border-white/10 bg-white/5">
                      {user.role?.toLowerCase() === 'admin' ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {user.isBan ? (
                      <span className="text-red-300">Banned</span>
                    ) : (
                      <span className="text-emerald-300">Active</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => banMutation.mutate(user)}
                        className="px-3 py-1.5 rounded-lg text-xs border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10"
                      >
                        {user.isBan ? 'Unban' : 'Ban'}
                      </button>
                      <button
                        onClick={() => roleMutation.mutate(user)}
                        className="px-3 py-1.5 rounded-lg text-xs border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10"
                      >
                        {user.role?.toLowerCase() === 'admin' ? 'Make User' : 'Make Admin'}
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
            onClick={() => handlePageChange('prev')}
            className="px-3 py-1.5 rounded-lg text-sm border border-white/10 disabled:opacity-40 disabled:cursor-not-allowed hover:border-white/20 bg-white/5 hover:bg-white/10"
          >
            Prev
          </button>
          <button
            disabled={!canNext}
            onClick={() => handlePageChange('next')}
            className="px-3 py-1.5 rounded-lg text-sm border border-white/10 disabled:opacity-40 disabled:cursor-not-allowed hover:border-white/20 bg-white/5 hover:bg-white/10"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Users;
