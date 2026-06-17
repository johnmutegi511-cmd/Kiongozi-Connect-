import React from 'react'
import type { Post } from '@/lib/types'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="post-card">
      <div className="post-content">
        <p>{post.content}</p>
      </div>

      {post.media_urls && post.media_urls.length > 0 && (
        <div className="post-media">
          {post.media_urls.map((url, index) => (
            <img key={index} src={url} alt={`Post media ${index + 1}`} />
          ))}
        </div>
      )}

      <div className="post-stats">
        <span className="likes">{post.likes_count} likes</span>
        <span className="comments">{post.comments_count} comments</span>
        <span className="shares">{post.shares_count} shares</span>
      </div>

      <div className="post-actions">
        <button className="action-btn">Like</button>
        <button className="action-btn">Comment</button>
        <button className="action-btn">Share</button>
      </div>
    </article>
  )
}
