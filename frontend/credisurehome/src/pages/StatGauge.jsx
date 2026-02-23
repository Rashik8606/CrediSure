import React from "react"
import "../css/stat-gauge.css"

const StatGauge = ({ label, value, color }) => {
  const percentage = Math.min(Math.max(value, 0), 100)
  const dash = (percentage * 125) / 100

  return (
    <div className="gauge-wrapper">
      <svg viewBox="0 0 100 50" className="gauge">
        {/* background */}
        <path
          d="M10 50 A40 40 0 0 1 90 50"
          className="gauge-bg"
        />

        {/* progress */}
        <path
          d="M10 50 A40 40 0 0 1 90 50"
          className="gauge-fill"
          style={{
            strokeDasharray: `${dash} 125`,
            stroke: color
          }}
        />
      </svg>

      <div className="gauge-content">
        <span className="gauge-value">{percentage}%</span>
        <span className="gauge-label"> {label}</span>
      </div>
    </div>
  )
}

export default StatGauge