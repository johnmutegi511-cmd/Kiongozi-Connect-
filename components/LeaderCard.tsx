import React from 'react'
import type { Leader } from '@/lib/types'

interface LeaderCardProps {
  leader: Leader
}

export default function LeaderCard({ leader }: LeaderCardProps) {
  return (
    <div className="leader-card">
      <div className="card-header">
        <h3>{leader.position}</h3>
        {leader.verified && <span className="verified-badge">✓ Verified</span>}
      </div>
      <div className="card-body">
        <p className="ward">{leader.ward}</p>
        <p className="constituency">{leader.constituency}</p>
        <div className="stats">
          <span className="followers">{leader.followers_count} followers</span>
        </div>
      </div>
    </div>
  )
}
