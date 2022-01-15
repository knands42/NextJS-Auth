import { Can } from 'components/Can'
import { User, UserPermissions, UserRoles } from 'contexts/AuthContext/types'
import { useAuthContext } from 'hooks/useAuthContext'
import { GetServerSideProps, NextPage } from 'next'
import { useEffect } from 'react'
import { setupAPIClient } from 'services/api'
import { api } from 'services/apiClient'
import { withSSRAuth } from 'utils/higherOrderFunctions/withSSRAuth'
import { ServerUris } from 'utils/routes'

const Dashboard: NextPage = () => {
  const { user, signOut } = useAuthContext()

  useEffect(() => {
    api.get<User>(ServerUris.ME).then(response => console.log(response))
  }, [])

  return (
    <>
      <div>Dashboard: {user?.email}</div>

      <button onClick={signOut}>Sign Out</button>

      <Can
        permissions={[UserPermissions.metricsList]}
        roles={[UserRoles.administrator, UserRoles.editor]}
      >
        <div>Metrics</div>
      </Can>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = withSSRAuth(async ctx => {
  const apiServer = setupAPIClient(ctx)
  await apiServer.get<User>(ServerUris.ME)

  return {
    props: {}
  }
})

export default Dashboard
