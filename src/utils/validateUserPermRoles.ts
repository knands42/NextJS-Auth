import { UserPermRoles } from 'contexts/AuthContext/types'

type ValidateUserPermRoles = UserPermRoles & {
  user: UserPermRoles
}

function validateUserPermRoles({
  user,
  permissions,
  roles
}: ValidateUserPermRoles) {
  const checkPermissions = (): boolean => {
    if (permissions && permissions?.length > 0) {
      return permissions.every(permission =>
        user.permissions?.includes(permission)
      )
    }

    return true
  }

  const checkRoles = (): boolean => {
    if (roles && roles?.length > 0) {
      return roles.some(role => user.roles?.includes(role))
    }

    return true
  }

  return checkPermissions() && checkRoles()
}

export { validateUserPermRoles }
