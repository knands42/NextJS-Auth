import { NextPage } from 'next'
import { createContext, useState, useEffect } from 'react'
import { api } from 'services/apiClient'
import { ServerUris } from 'utils/routes'
import {
  setTokenCookie,
  setHeaderAuthorization,
  unsetTokenCookie,
  getToken
} from 'utils/cookies'
import { goToDashboard, goToLogin } from 'utils/routes'
import {
  AuthContextData,
  BroadcastMessagesEvent,
  SignInRequest,
  SignInResponse,
  User
} from './types'

const AuthContext = createContext({} as AuthContextData)
let authChannel: BroadcastChannel

const AuthProvider: NextPage = ({ children }) => {
  const [user, setUser] = useState<User>({} as User)
  const isAuthenticated = !!user

  useEffect(() => {
    authChannel = new BroadcastChannel('auth')
    authChannel.onmessage = async (message: MessageEvent<string>) => {
      type eventType = { [key: string]: () => void }

      const events: eventType = {
        // [BroadcastMessagesEvent.SIGNIN]: () => goToDashboard(),
        [BroadcastMessagesEvent.SIGNOUT]: () => goToLogin()
      }

      await events[message.data]()
    }
  }, [])

  useEffect(() => {
    const token = getToken()

    if (token) {
      api
        .get<User>(ServerUris.ME)
        .then(response => {
          const { email, permissions, roles } = response.data

          setUser({ email, permissions, roles })
        })
        .catch(() => {
          signOut()
        })
    }
  }, [])

  async function signIn({ email, password }: SignInRequest): Promise<void> {
    try {
      const response = await api.post<SignInResponse>(ServerUris.SESSIONS, {
        email,
        password
      })

      const { roles, permissions, token, refreshToken } = response.data

      setTokenCookie(token, refreshToken)
      setHeaderAuthorization(token)
      setUser({ email, permissions, roles })

      goToDashboard()

      authChannel.postMessage(BroadcastMessagesEvent.SIGNIN)
    } catch (err) {
      console.error(err)
    }
  }

  async function signOut(): Promise<void> {
    unsetTokenCookie()
    setUser({} as User)
    goToLogin()

    authChannel.postMessage(BroadcastMessagesEvent.SIGNOUT)
  }

  return (
    <AuthContext.Provider value={{ signIn, signOut, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthProvider, AuthContext }
