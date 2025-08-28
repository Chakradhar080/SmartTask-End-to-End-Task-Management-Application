import API_URL from "../config";

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signup, login } from '../api'

export default function Signup() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      await signup({ username, password })
      const { data } = await login(username, password)
      localStorage.setItem('token', data.access_token)
      setSuccess('Account created! Redirecting...')
      setTimeout(() => navigate('/dashboard'), 500)
    } catch (err) {
      setError(err?.response?.data?.detail || 'Signup failed')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="card">
        <h1 className="text-2xl font-semibold mb-4">Create an account ✨</h1>
        {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
        {success && <div className="mb-3 text-green-600 text-sm">{success}</div>}
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="label">Username</label>
            <input className="input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="choose a username" />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <button className="btn btn-primary w-full" type="submit">Sign Up</button>
        </form>
        <p className="text-sm text-gray-600 mt-4">Already have an account? <Link to="/login" className="text-indigo-600">Login</Link></p>
      </div>
    </div>
  )
}
