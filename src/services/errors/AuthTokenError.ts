import { UndefinedString } from 'types'

class AuthTokenError extends Error {
  constructor(msg: UndefinedString = undefined) {
    super(msg ?? 'Error with authentication token.')
  }
}

export { AuthTokenError }
