import { UserPermRoles } from 'contexts/AuthContext/types'
import { useCan } from 'hooks/useCan'
import { NextPage } from 'next'

const Can: NextPage<UserPermRoles> = ({ permissions, children, roles }) => {
  const userCanSeeComponent = useCan({ permissions, roles })

  return !userCanSeeComponent ? null : <>{children}</>
}

export { Can }
