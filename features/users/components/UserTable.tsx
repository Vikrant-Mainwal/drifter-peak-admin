'use client'

import { useState } from 'react'
import { toggleAdminStatus } from '../lib/actions/user.actions'
import type { Profile } from '../lib/actions/user.actions'

type Props = {
  users: Profile[]
  currentUserId: string   // pass logged-in user id to disable self-toggle
}

export default function UserTable({ users, currentUserId }: Props) {
  // Optimistic local state: track which user ids are toggling + their current value
  const [localAdmins, setLocalAdmins] = useState<Record<string, boolean>>(
    () => Object.fromEntries(users.map((u) => [u.id, u.is_admin]))
  )
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [errorId, setErrorId] = useState<string | null>(null)

  async function handleToggle(userId: string, currentlyAdmin: boolean) {
    const next = !currentlyAdmin

    // Optimistic update — flip immediately in UI
    setLocalAdmins((prev) => ({ ...prev, [userId]: next }))
    setLoadingId(userId)
    setErrorId(null)

    const result = await toggleAdminStatus(userId, next)

    setLoadingId(null)

    if (!result.success) {
      // Revert on failure
      setLocalAdmins((prev) => ({ ...prev, [userId]: currentlyAdmin }))
      setErrorId(userId)
    }
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400 text-sm">
        No users found.
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/60">
            <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide w-8">#</th>
            <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">User</th>
            <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Phone</th>
            <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Joined</th>
            <th className="text-center px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Role</th>
            <th className="text-center px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Admin access</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {users.map((user, idx) => {
            const isAdmin = localAdmins[user.id] ?? user.is_admin
            const isLoading = loadingId === user.id
            const hasError = errorId === user.id
            const isSelf = user.id === currentUserId

            return (
              <tr
                key={user.id}
                className={`transition-colors ${
                  isAdmin ? 'bg-purple-50/40 hover:bg-purple-50/70' : 'hover:bg-gray-50'
                }`}
              >
                {/* Row number */}
                <td className="px-5 py-3.5 text-xs text-gray-400 tabular-nums">
                  {idx + 1}
                </td>

                {/* Avatar + name */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                      isAdmin
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {(user.name?.[0] ?? user.phone?.[0] ?? '?').toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 leading-tight">
                        {user.name ?? <span className="text-gray-400 font-normal">No name</span>}
                      </div>
                      {user.email && (
                        <div className="text-xs text-gray-400 leading-tight mt-0.5">{user.email}</div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Phone */}
                <td className="px-5 py-3.5 text-gray-500 tabular-nums text-xs">
                  {user.phone}
                </td>

                {/* Joined date */}
                <td className="px-5 py-3.5 text-gray-400 text-xs">
                  {new Date(user.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </td>

                {/* Role badge */}
                <td className="px-5 py-3.5 text-center">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    isAdmin
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {isAdmin && (
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 inline-block" />
                    )}
                    {isAdmin ? 'Admin' : 'User'}
                  </span>
                </td>

                {/* Toggle */}
                <td className="px-5 py-3.5">
                  <div className="flex flex-col items-center gap-1">
                    <button
                      role="switch"
                      aria-checked={isAdmin}
                      aria-label={`Toggle admin for ${user.name ?? user.phone}`}
                      disabled={isLoading || isSelf}
                      onClick={() => handleToggle(user.id, isAdmin)}
                      className={`
                        relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full
                        border-2 border-transparent transition-colors duration-200 ease-in-out
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500
                        disabled:cursor-not-allowed disabled:opacity-40
                        ${isAdmin ? 'bg-purple-600' : 'bg-gray-200'}
                        ${isLoading ? 'opacity-60' : ''}
                      `}
                    >
                      <span
                        className={`
                          pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow
                          ring-0 transition-transform duration-200 ease-in-out
                          ${isAdmin ? 'translate-x-5' : 'translate-x-0'}
                        `}
                      />
                    </button>

                    {/* Self-protection label */}
                    {isSelf && (
                      <span className="text-[10px] text-gray-400">you</span>
                    )}

                    {/* Error indicator */}
                    {hasError && (
                      <span className="text-[10px] text-red-500">failed</span>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}