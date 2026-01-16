import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function Layout() {
  return (
    <div className="min-h-screen bg-primary">
      <Navbar />
      <main className="pt-4">
        <Outlet />
      </main>
    </div>
  )
}
