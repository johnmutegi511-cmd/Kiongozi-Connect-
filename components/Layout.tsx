import React, { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="layout">
      <header className="header">
        <div className="container">
          <nav className="navbar">
            <div className="logo">
              <h1>Kiongozi Connect</h1>
            </div>
            <ul className="nav-links">
              <li><a href="/">Home</a></li>
              <li><a href="/leaders">Leaders</a></li>
              <li><a href="/projects">Projects</a></li>
              <li><a href="/meetings">Meetings</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="main">
        <div className="container">
          {children}
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2026 Kiongozi Connect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
