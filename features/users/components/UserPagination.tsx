import Link from 'next/link'

type Props = {
  currentPage: number
  totalPages: number
  totalCount: number
}

export default function UserPagination({ currentPage, totalPages, totalCount }: Props) {
  const PAGE_SIZE = 10
  const from = (currentPage - 1) * PAGE_SIZE + 1
  const to = Math.min(currentPage * PAGE_SIZE, totalCount)

  // Generate visible page numbers with ellipsis logic
  function getPageNumbers(): (number | '…')[] {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const pages: (number | '…')[] = [1]

    if (currentPage > 3) pages.push('…')

    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)

    for (let i = start; i <= end; i++) pages.push(i)

    if (currentPage < totalPages - 2) pages.push('…')

    pages.push(totalPages)
    return pages
  }

  return (
    <div className="mt-4 flex items-center justify-between">
      {/* Count info */}
      <p className="text-xs text-gray-500">
        Showing {from}–{to} of {totalCount} users
      </p>

      {/* Page controls */}
      <div className="flex items-center gap-1">
        {/* Prev */}
        {currentPage > 1 ? (
          <Link
            href={`?page=${currentPage - 1}`}
            className="px-3 py-1.5 text-xs text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            ← Prev
          </Link>
        ) : (
          <span className="px-3 py-1.5 text-xs text-gray-300 bg-white border border-gray-100 rounded-lg cursor-not-allowed">
            ← Prev
          </span>
        )}

        {/* Page numbers */}
        {getPageNumbers().map((page, idx) =>
          page === '…' ? (
            <span key={`ellipsis-${idx}`} className="px-2 py-1.5 text-xs text-gray-400">
              …
            </span>
          ) : (
            <Link
              key={page}
              href={`?page=${page}`}
              className={`min-w-8 px-2.5 py-1.5 text-xs text-center rounded-lg transition-colors ${
                page === currentPage
                  ? 'bg-gray-900 text-white font-medium'
                  : 'text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {page}
            </Link>
          )
        )}

        {/* Next */}
        {currentPage < totalPages ? (
          <Link
            href={`?page=${currentPage + 1}`}
            className="px-3 py-1.5 text-xs text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            Next →
          </Link>
        ) : (
          <span className="px-3 py-1.5 text-xs text-gray-300 bg-white border border-gray-100 rounded-lg cursor-not-allowed">
            Next →
          </span>
        )}
      </div>
    </div>
  )
}