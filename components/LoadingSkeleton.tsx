import React, { useState, useEffect } from 'react'

interface LoadingSkeletonProps {
  count?: number
  height?: string
  width?: string
}

export default function LoadingSkeleton({
  count = 3,
  height = '100px',
  width = '100%',
}: LoadingSkeletonProps) {
  return (
    <div className="skeleton-container">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="skeleton"
          style={{
            height,
            width,
            marginBottom: '1rem',
          }}
        />
      ))}
    </div>
  )
}
