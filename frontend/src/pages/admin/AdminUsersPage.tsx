import { useState } from 'react';
import toast from 'react-hot-toast';
import type { AdminUsersParams } from '../../api/admin.api';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { TableSkeleton } from '../../components/admin/TableSkeleton';
import { tableClass, tableWrap, tdClass, theadClass, thClass } from '../../components/admin/tableStyles';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { EmptyState } from '../../components/ui/EmptyState';
import { Pagination } from '../../components/ui/Pagination';
import { inputClass, selectClass } from '../../components/ui/styles';
import { useAdminUsers, useDeleteUser, useUpdateUser } from '../../hooks/useAdmin';
import { useAuth } from '../../hooks/useAuth';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import type { Role, User } from '../../types';
import { getErrorMessage } from '../../utils/error';
import { formatDate } from '../../utils/format';

type StatusFilter = '' | 'active' | 'disabled';

export function AdminUsersPage() {
    const { user: me } = useAuth();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [role, setRole] = useState<Role | ''>('');
    const [status, setStatus] = useState<StatusFilter>('');
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const debouncedSearch = useDebouncedValue(search.trim());

    const params: AdminUsersParams = {
        page,
        limit: 10,
        search: debouncedSearch || undefined,
        role: role || undefined,
        isActive: status === '' ? undefined : status === 'active',
    };

    const { data, isPending, isError, isPlaceholderData, refetch } = useAdminUsers(params);
    const updateUser = useUpdateUser();
    const deleteUser = useDeleteUser();

    const changeRole = async (target: User, nextRole: Role) => {
        try {
            await updateUser.mutateAsync({ id: target.id, changes: { role: nextRole } });
            toast.success(`${target.name} is now ${nextRole === 'admin' ? 'an admin' : 'a regular user'}`);
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    const toggleActive = async (target: User) => {
        try {
            await updateUser.mutateAsync({ id: target.id, changes: { isActive: !target.isActive } });
            toast.success(`${target.name} ${target.isActive ? 'deactivated' : 'activated'}`);
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;
        try {
            await deleteUser.mutateAsync(userToDelete.id);
            toast.success('User deleted');
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setUserToDelete(null);
        }
    };

    return (
        <>
            <AdminPageHeader title="Users" description="Manage accounts, roles and access." />

            <div className="mb-4 flex flex-wrap gap-3">
                <input
                    type="search"
                    aria-label="Search users"
                    placeholder="Search by name or email…"
                    value={search}
                    onChange={(event) => {
                        setSearch(event.target.value);
                        setPage(1);
                    }}
                    className={`${inputClass} max-w-xs`}
                />
                <select
                    aria-label="Filter by role"
                    value={role}
                    onChange={(event) => {
                        setRole(event.target.value as Role | '');
                        setPage(1);
                    }}
                    className={selectClass}
                >
                    <option value="">All roles</option>
                    <option value="user">Users</option>
                    <option value="admin">Admins</option>
                </select>
                <select
                    aria-label="Filter by status"
                    value={status}
                    onChange={(event) => {
                        setStatus(event.target.value as StatusFilter);
                        setPage(1);
                    }}
                    className={selectClass}
                >
                    <option value="">All statuses</option>
                    <option value="active">Active</option>
                    <option value="disabled">Disabled</option>
                </select>
            </div>

            {isPending && <TableSkeleton />}

            {isError && (
                <EmptyState icon="⚠️" title="Could not load users">
                    <Button onClick={() => refetch()}>Retry</Button>
                </EmptyState>
            )}

            {data && data.items.length === 0 && (
                <EmptyState icon="🔍" title="No users match your filters" description="Try a different search or filter." />
            )}

            {data && data.items.length > 0 && (
                <>
                    <div className={`${tableWrap} ${isPlaceholderData ? 'opacity-60 transition-opacity' : ''}`}>
                        <table className={tableClass}>
                            <thead className={theadClass}>
                                <tr>
                                    <th className={thClass}>User</th>
                                    <th className={thClass}>Role</th>
                                    <th className={thClass}>Status</th>
                                    <th className={thClass}>Joined</th>
                                    <th className={`${thClass} text-right`}>Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {data.items.map((target) => {
                                    const isSelf = target.id === me?.id;
                                    const busy = updateUser.isPending && updateUser.variables?.id === target.id;

                                    return (
                                        <tr key={target.id} className={busy ? 'opacity-60' : undefined}>
                                            <td className={tdClass}>
                                                <div className="flex items-center gap-3">
                                                    <Avatar name={target.name} />
                                                    <div className="min-w-0">
                                                        <p className="flex items-center gap-2 truncate font-medium text-slate-900">
                                                            {target.name}
                                                            {isSelf && <Badge tone="indigo">You</Badge>}
                                                        </p>
                                                        <p className="truncate text-xs text-slate-500">{target.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className={tdClass}>
                                                <select
                                                    aria-label={`Role for ${target.name}`}
                                                    value={target.role}
                                                    disabled={isSelf || busy}
                                                    onChange={(event) => changeRole(target, event.target.value as Role)}
                                                    className={selectClass}
                                                >
                                                    <option value="user">User</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </td>
                                            <td className={tdClass}>
                                                <Badge tone={target.isActive ? 'green' : 'red'}>
                                                    {target.isActive ? 'Active' : 'Disabled'}
                                                </Badge>
                                            </td>
                                            <td className={`${tdClass} whitespace-nowrap text-slate-500`}>
                                                {formatDate(target.createdAt)}
                                            </td>
                                            <td className={`${tdClass} text-right`}>
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="secondary"
                                                        disabled={isSelf || busy}
                                                        onClick={() => toggleActive(target)}
                                                    >
                                                        {target.isActive ? 'Deactivate' : 'Activate'}
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="danger"
                                                        disabled={isSelf || busy}
                                                        onClick={() => setUserToDelete(target)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <Pagination page={data.meta.page} totalPages={data.meta.totalPages} onChange={setPage} />
                </>
            )}

            <ConfirmDialog
                open={userToDelete !== null}
                title="Delete this user?"
                message={`${userToDelete?.name ?? 'This user'} will be removed permanently. Their posts are taken down and their comments are deleted.`}
                loading={deleteUser.isPending}
                onConfirm={confirmDelete}
                onCancel={() => setUserToDelete(null)}
            />
        </>
    );
}