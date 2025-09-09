import React from 'react'

export default function GamePanel({ 
  children, 
  className = "", 
  style = {} 
}) {
  return (
    <div className={`w-[567px] ${className}`} style={style}>
      <div className="text-center" style={{ width: '567px' }}>
        {/* Timer area - empty/transparent */}
        <div className="h-[63px] mb-2"></div>
        
        {/* Main area - consistent sizing across all routes */}
        <div 
          className="bg-[#ffff00] border-4 border-black p-4 mb-4"
          style={{
            width: '567px',
            height: '517px',
            borderRadius: '64px',
            boxShadow: '4px 4px 0px 0px #000000'
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

