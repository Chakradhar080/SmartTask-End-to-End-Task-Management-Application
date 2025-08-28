import { useNavigate, NavLink } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <NavLink to="/" className="text-xl font-semibold text-indigo-700">
          Task Manager
        </NavLink>
        <nav className="flex gap-3 items-center">
          {token ? (
            <>
              <NavLink className="btn btn-secondary" to="/dashboard">Dashboard</NavLink>
              <button className="btn btn-primary" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <NavLink className="btn btn-secondary" to="/login">Login</NavLink>
              <NavLink className="btn btn-primary" to="/signup">Sign Up</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
