import { Cookies } from 'contexts/AuthContext/types'
import { setCookie } from 'nookies'
import { api } from 'services/api'

function setCookiesWhenSignIn(token: string, refreshToken: string) {
  setCookie(undefined, Cookies.token, token, {
    maxAge: 60 * 60 * 25 * 30,
    path: '/'
  })
  setCookie(undefined, Cookies.refreshToken, refreshToken, {
    maxAge: 60 * 60 * 25 * 30,
    path: '/'
  })
}

function setHeaderAuthorization(token: string) {
  api.defaults.headers['Authorization'] = `Bearer ${token}`
}

export { setCookiesWhenSignIn, setHeaderAuthorization }
