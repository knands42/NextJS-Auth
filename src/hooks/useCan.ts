import { validateUserPermRoles } from 'utils/validateUserPermRoles'
import { UserPermRoles } from '../contexts/AuthContext/types'
import { useAuthContext } from './useAuthContext'

function useCan({ permissions, roles }: UserPermRoles): boolean {
  const { isAuthenticated, user } = useAuthContext()

  if (!isAuthenticated) return false

  return validateUserPermRoles({ permissions, roles, user })
}

export { useCan }
