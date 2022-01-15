import { NextPage } from 'next'
import { createContext, useContext, useState, useEffect } from 'react'
import { api } from 'services/apiClient'
import {
  setTokenCookie,
  setHeaderAuthorization,
  unsetTokenCookie,
  getToken
} from 'utils/cookies'
import { goToDashboard, goToLogin } from 'utils/routes'
import { AuthContextData, SignInRequest, SignInResponse, User } from './types'

const AuthContext = createContext({} as AuthContextData)

const AuthProvider: NextPage = ({ children }) => {
  const [user, setUser] = useState<User>({} as User)
  const isAuthenticated = !!user

  useEffect(() => {
    const token = getToken()

    if (token) {
      api
        .get<User>('/me')
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
      const response = await api.post<SignInResponse>('sessions', {
        email,
        password
      })

      const { roles, permissions, token, refreshToken } = response.data

      setTokenCookie(token, refreshToken)
      setHeaderAuthorization(token)
      setUser({ email, permissions, roles })

      goToDashboard()
    } catch (err) {
      console.error(err)
    }
  }

  async function signOut(): Promise<void> {
    unsetTokenCookie()
    setUser({} as User)
    goToLogin()
  }

  return (
    <AuthContext.Provider value={{ signIn, signOut, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  )
}

const useAuthContext = () => useContext(AuthContext)

export { AuthProvider, useAuthContext }
