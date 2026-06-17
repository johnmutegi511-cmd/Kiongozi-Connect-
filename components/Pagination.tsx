import React from 'react'

interface PaginationProps {
  currentPage?: number
  totalPages?: number
  onPageChange?: (page: number) => void
}

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}: PaginationProps) {
  const pages = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  )

  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        justifyContent: 'center',
        marginTop: '20px',
      }}
    >
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange?.(page)}
          style={{
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            cursor: 'pointer',
            background:
              page === currentPage ? '#16a34a' : '#ffffff',
            color:
              page === currentPage ? '#ffffff' : '#000000',
          }}
        >
          {page}
        </button>
      ))}
    </div>
  )
}
