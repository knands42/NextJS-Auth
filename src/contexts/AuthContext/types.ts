export enum UserRoles {
  administrator = 'administrator',
  editor = 'editor'
}

export enum UserPermissions {
  userList = 'users.list',
  userCreate = 'users.create',
  metricsList = 'metrics.list'
}

export enum Cookies {
  token = 'nextauth.token',
  refreshToken = 'nextauth.refreshToken',
}

export type User = {
  email: string
  permissions: UserPermissions[]
  roles: UserRoles[]
}

export type SignInResponse = {
  permissions: UserPermissions[],
  refreshToken: string,
  roles: UserRoles[],
  token: string
}

export type SignInRequest = {
  email: string
  password: string
}

export type AuthContextData = {
  signIn(credentials: SignInRequest): Promise<void>
  user: User
  isAuthenticated: boolean
}
