import { NextPage } from 'next'
import Router from 'next/router'
import { parseCookies, setCookie } from 'nookies'
import { createContext, useContext, useState, useEffect } from 'react'
import { api } from 'services/api'
import { setCookiesWhenSignIn, setHeaderAuthorization } from 'utils/cookies'
import {
  AuthContextData,
  Cookies,
  SignInRequest,
  SignInResponse,
  User
} from './types'

const AuthContext = createContext({} as AuthContextData)

const AuthProvider: NextPage = ({ children }) => {
  const [user, setUser] = useState<User>({} as User)
  const isAuthenticated = !!user

  useEffect(() => {
    const cookies = parseCookies()
    const token = cookies[Cookies.token]

    if (token) {
      api.get<User>('/me').then(response => {
        const { email, permissions, roles } = response.data

        setUser({ email, permissions, roles })
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

      setCookiesWhenSignIn(token, refreshToken)
      setHeaderAuthorization(token)
      setUser({ email, permissions, roles })

      Router.push('/dashboard')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  )
}

const useAuthContext = () => useContext(AuthContext)

export { AuthProvider, useAuthContext }
