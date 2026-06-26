import { getPaginatedUsers } from '../../../features/users/lib/actions/user.actions'
import UserTable from '../../../features/users/components/UserTable'
import UserPagination from '../../../features/users/components/UserPagination'

type Props = {
  searchParams: Promise<{ page?: string }>
}

export default async function UsersPage({ searchParams }: Props) {
  const params = await searchParams
  const page = Math.max(1, parseInt(params.page ?? '1', 10) || 1)

  const { users, totalCount, totalPages, currentPage } = await getPaginatedUsers(page)

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {totalCount} total · admins shown first
          </p>
        </div>
      </div>

      {/* Table */}
      <UserTable users={users} currentUserId={''} />

      {/* Pagination — only renders if more than 1 page */}
      {totalPages > 1 && (
        <UserPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
        />
      )}
    </div>
  )
}