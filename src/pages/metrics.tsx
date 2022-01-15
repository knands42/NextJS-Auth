import { User, UserPermissions, UserRoles } from 'contexts/AuthContext/types'
import { GetServerSideProps, NextPage } from 'next'
import { setupAPIClient } from 'services/api'
import { withSSRAuth } from 'utils/higherOrderFunctions/withSSRAuth'
import { ServerUris } from 'utils/routes'

const Metrics: NextPage = () => {
  return (
    <>
      <h1>Metrics</h1>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = withSSRAuth(
  async ctx => {
    const apiServer = setupAPIClient(ctx)
    await apiServer.get<User>(ServerUris.ME)

    return {
      props: {}
    }
  },
  {
    permissions: [UserPermissions.metricsList],
    roles: [UserRoles.administrator]
  }
)

export default Metrics
