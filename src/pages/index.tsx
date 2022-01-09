import { useAuthContext } from 'contexts/AuthContext'
import type { NextPage } from 'next'
import { FormEvent, useState } from 'react'

const Home: NextPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { isAuthenticated, signIn } = useAuthContext()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const data = {
      email,
      password
    }

    await signIn(data)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button type="submit">SignIn</button>
    </form>
  )
}

export default Home
