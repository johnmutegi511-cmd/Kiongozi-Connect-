# Performance Optimization Guide for Kiongozi Connect

## Database Query Optimizations

### 1. Add Database Indexes
Create indexes on frequently queried fields:

```sql
-- User lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Post queries
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_user_created ON posts(user_id, created_at DESC);

-- Leader discovery
CREATE INDEX idx_leaders_verified ON leaders(verified);
CREATE INDEX idx_leaders_followers ON leaders(followers_count DESC);
CREATE INDEX idx_leaders_ward ON leaders(ward);

-- Project filtering
CREATE INDEX idx_projects_leader_id ON projects(leader_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_leader_status ON projects(leader_id, status);

-- Meeting queries
CREATE INDEX idx_meetings_leader_id ON meetings(leader_id);
CREATE INDEX idx_meetings_date_time ON meetings(date_time);

-- Notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_read ON notifications(user_id, read);
```

### 2. Enable Query Result Caching
Use Supabase cache headers:

```typescript
// In queries.ts - Add cache headers to GET requests
const { data } = await supabase
  .from('leaders')
  .select('...')
  .limit(20)

// The API automatically caches with max-age
```

### 3. Implement Connection Pooling
Configure in Supabase dashboard:
- Enable Connection Pooling for PostgreSQL
- Set pool mode to "Transaction"
- Set pool size to 15-25

## Frontend Optimizations

### 1. Image Optimization
- Use Next.js `<Image>` component (already in components)
- Configure image formats in `next.config.js` (WebP, AVIF)
- Lazy load images with `loading="lazy"`

### 2. Implement Virtual Scrolling
For long lists:

```typescript
import { FixedSizeList } from 'react-window'

// Use for large feeds
<FixedSizeList height={600} itemCount={1000} itemSize={120}>
  {({ index, style }) => (
    <div style={style}>
      <PostCard post={posts[index]} />
    </div>
  )}
</FixedSizeList>
```

### 3. Code Splitting
Automatically handled by Next.js, but optimize with:

```typescript
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('@/components/Heavy'), {
  loading: () => <LoadingSkeleton />,
})
```

## API Performance

### 1. Response Compression
Already enabled in `next.config.js`

### 2. Implement Proper Caching Headers
- GET /api/leaders: 60s max-age (already implemented)
- GET /api/posts: 30s max-age (feed changes frequently)
- GET /api/projects: 120s max-age (static content)

### 3. Rate Limiting
Implement with middleware:

```typescript
// Add to lib/api-helpers.ts
const rateLimit = new Map<string, number[]>()

export function checkRateLimit(ip: string, limit: number = 100, window: number = 60000) {
  const now = Date.now()
  const requests = rateLimit.get(ip) || []
  const recentRequests = requests.filter(t => now - t < window)
  
  if (recentRequests.length >= limit) {
    throw new Error('Rate limit exceeded')
  }
  
  rateLimit.set(ip, [...recentRequests, now])
}
```

## Real-time Subscriptions Optimization

### Use Row-Level Security (RLS)
Enable in Supabase to filter real-time events by user:

```typescript
// Subscribe only to own notifications
const subscription = supabase
  .from('notifications')
  .on('*', (payload) => {
    console.log('Change received!', payload)
  })
  .subscribe()
```

## Monitoring and Profiling

### 1. Web Vitals
Already set up - monitor in Vercel dashboard

### 2. Database Slow Queries
Enable in Supabase: Settings → Database → Slow Query Log

### 3. API Response Times
Use the timing utilities in `lib/utils.ts`:

```typescript
const stopTimer = measurePerformance('getLeaders')
// ... do work
stopTimer() // Logs: [getLeaders] 145.23ms
```

## Deployment Optimization

### Vercel-specific
- Enable ISR (Incremental Static Regeneration) for leader pages
- Use Edge Functions for routing optimization
- Enable Middleware for request filtering

### Example ISR:
```typescript
// pages/leaders/[id].tsx
export async function getStaticProps({ params }) {
  return {
    props: { ... },
    revalidate: 3600 // Revalidate every hour
  }
}
```

## Monitoring Checklist

- [ ] Set up Sentry for error tracking
- [ ] Enable Supabase Analytics
- [ ] Configure Vercel Web Analytics
- [ ] Set up email alerts for errors
- [ ] Monitor database connection pool
- [ ] Track Core Web Vitals
- [ ] Set up performance budgets

## Next Steps

1. Implement database indexes immediately
2. Enable connection pooling
3. Add monitoring and alerting
4. Implement virtual scrolling for feeds
5. Set up ISR for static pages
6. Profile and optimize hot paths
