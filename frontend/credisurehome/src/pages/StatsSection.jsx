import React, { useEffect, useRef, useState } from 'react'
import '../css/stats-section.css'

const STATS = [
  {
    key: 'active-users',
    label: 'Active Users',
    to: 84320,
    trend: '+12.4%',
    trendDir: 'up',
    footer: 'vs last month',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4"/>
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
      </svg>
    ),
  },
  {
    key: 'active-loans',
    label: 'Users with Active Loans',
    to: 31450,
    trend: '+8.1%',
    trendDir: 'up',
    footer: 'vs last month',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2"/>
        <line x1="2" y1="10" x2="22" y2="10"/>
      </svg>
    ),
  },
  {
    key: 'applications',
    label: 'Loan Applications',
    to: 5870,
    trend: '-3.2%',
    trendDir: 'down',
    footer: 'vs last month',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14,2 14,8 20,8"/>
        <line x1="8" y1="13" x2="16" y2="13"/>
        <line x1="8" y1="17" x2="12" y2="17"/>
      </svg>
    ),
  },
]

function AnimatedCount({ to, duration = 1800 }) {
  const ref = useRef(null)
  const hasAnimated = useRef(false)

  const [darkMode, setDarkMode] = useState(()=>{
    const saved = localStorage.getItem('bp-theme')
    return saved ? saved === 'dark' : true
  })

  const toggleTheme = ()=>{
    const next = !darkMode
    setDarkMode(next)
    localStorage.setItem('bp-theme', next ? 'dark':'light')
  }

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true  // only animate once per mount
            const start = performance.now()
            const tick = (now) => {
              const t = Math.min((now - start) / duration, 1)
              const ease = 1 - Math.pow(1 - t, 4)
              el.textContent = Math.round(ease * to).toLocaleString('en-IN')
              if (t < 1) requestAnimationFrame(tick)
            }
            requestAnimationFrame(tick)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.3 }  // triggers when 30% of card is visible
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [to, duration])

  return <span ref={ref}>0</span>
}

export default function StatsSection({ darkMode }) {
  return (
    <section className={`ss-section ${darkMode ? 'dark' : 'light'}`}>
      <div className="ss-inner">
        <p className="ss-heading">Platform Overview</p>
        <div className="ss-grid">
          {STATS.map(({ key, label, to, trend, trendDir, footer, icon }) => (
            <div key={key} className={`ss-card ss-card--${key}`}>
              <div className={`ss-icon-wrap ss-icon--${key}`}>{icon}</div>
              <p className="ss-label">{label}</p>
              <p className="ss-value">
                <AnimatedCount to={to} />
              </p>
              <div className="ss-footer-row">
                <span className={`ss-badge ss-badge--${trendDir}`}>
                  {trendDir === 'up' ? '▲' : '▼'} {trend}
                </span>
                <span className="ss-footer">{footer}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}