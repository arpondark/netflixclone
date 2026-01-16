import { useAuth } from '../context/AuthContext'
import UserHome from '../pages/UserHome'
import AdminDashboard from '../pages/AdminDashboard'

export default function HomePage() {
  const { isAdmin } = useAuth()

  if (isAdmin()) {
    return <AdminDashboard />
  }

  return <UserHome />
}
