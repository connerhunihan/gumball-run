import { Outlet } from 'react-router-dom'

export default function App() {
  return (
    <div className="h-screen w-screen bg-[#8eebff] overflow-hidden">
      <Outlet />
    </div>
  )
}



