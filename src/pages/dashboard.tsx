import { useAuthContext } from 'contexts/AuthContext'
import { User } from 'contexts/AuthContext/types'
import { NextPage } from 'next'
import { useEffect } from 'react'
import { api } from 'services/api'

const Dashboard: NextPage = () => {
  const { user } = useAuthContext()

  useEffect(() => {
    api.get<User>('/me').then(response => console.log(response))
  }, [])

  return <div>Dashboard: {user?.email}</div>
}

export default Dashboard
