import { useAuthContext } from 'contexts/AuthContext'
import { User } from 'contexts/AuthContext/types'
import { GetServerSideProps, NextPage } from 'next'
import { useEffect } from 'react'
import { setupAPIClient } from 'services/api'
import { api } from 'services/apiClient'
import { withSSRAuth } from 'utils/withSSRAuth'

const Dashboard: NextPage = () => {
  const { user } = useAuthContext()

  useEffect(() => {
    api.get<User>('/me').then(response => console.log(response))
  }, [])

  return <div>Dashboard: {user?.email}</div>
}

export const getServerSideProps: GetServerSideProps = withSSRAuth(async ctx => {
  const apiServer = setupAPIClient(ctx)
  const response = await apiServer.get<User>('/me')

  console.log(response.data)

  return {
    props: {}
  }
})

export default Dashboard
