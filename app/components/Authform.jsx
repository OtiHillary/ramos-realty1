'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { redirect } from 'next/navigation'

export default function AuthForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    let result

    if (isLogin) {
      result = await supabase.auth.signInWithPassword({ email, password })
    } else {
      result = await supabase.auth.signUp({ email, password })
    }

    if (result.error) {
      setMessage(result.error.message)
    } else {
      localStorage.setItem('user', JSON.stringify(result.data.user))
      setMessage('Success! Check your inbox if needed.')
      redirect('/dashboard')
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-10 bg-white p-6 shadow-lg rounded-xl border">
      <h1 className='text-3xl text-blue-700 absolute top-0 left-0 p-4 font-black'>RamosRealty</h1>
      <h2 className="text-2xl text-blue-700 font-bold text-primary mb-4">{isLogin ? 'Login' : 'Sign Up'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 border rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full p-2 border rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="w-full bg-blue-700 text-white p-2 rounded hover:bg-blue-800 transition">
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
        <p
          className="text-sm text-blue-600 cursor-pointer hover:underline"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
        </p>
        {message && <p className="text-red-600">{message}</p>}
      </form>
    </div>
  )
}
