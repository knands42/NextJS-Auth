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
  refreshToken = 'nextauth.refreshToken'
}

export type User = UserPermRoles & {
  email: string
}

export type UserTokenDecode = UserPermRoles & {
  iat: number
  exp: number
  sub: string
}

export type SignInResponse = UserPermRoles & {
  refreshToken: string
  token: string
}

export type UserPermRoles = {
  permissions?: UserPermissions[]
  roles?: UserRoles[]
}

export type SignInRequest = {
  email: string
  password: string
}

export type AuthContextData = {
  signIn: (credentials: SignInRequest) => Promise<void>
  signOut: () => Promise<void>
  user: User
  isAuthenticated: boolean
}

export enum BroadcastMessagesEvent {
  SIGNIN = 'signIn',
  SIGNOUT = 'signOut'
}
