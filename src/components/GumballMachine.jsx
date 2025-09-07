export default function GumballMachine({ balls, count }) {
  return (
    <div className="relative">
      <svg width={320} height={360} className="drop-shadow">
        <defs>
          <radialGradient id="glass" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
          </radialGradient>
        </defs>
        <rect x="60" y="300" width="200" height="40" rx="8" fill="#475569" />
        <ellipse cx="160" cy="70" rx="70" ry="36" fill="#334155" />
        <rect x="90" y="90" width="140" height="220" rx="70" fill="url(#glass)" stroke="#94a3b8" />
        {balls.map((b, i) => (
          <circle key={i} cx={60 + b.x} cy={110 + b.y} r="8" fill={b.c} />
        ))}
      </svg>
    </div>
  )
}



