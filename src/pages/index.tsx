import { useAuthContext } from 'hooks/useAuthContext'
import type { GetServerSideProps, NextPage } from 'next'
import { FormEvent, useState } from 'react'
import { withSSRGuest } from 'utils/higherOrderFunctions/withSSRGuest'

const Home: NextPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { signIn } = useAuthContext()

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

export const getServerSideProps: GetServerSideProps = withSSRGuest(
  async ctx => {
    return {
      props: {}
    }
  }
)

export default Home
