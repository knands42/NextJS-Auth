import { Cookies } from 'contexts/AuthContext/types'
import { destroyCookie, parseCookies, setCookie } from 'nookies'
import { api } from 'services/api'

function getToken() {
  const cookies = parseCookies()
  return cookies[Cookies.token]
}

function getRefreshToken() {
  const cookies = parseCookies()
  return cookies[Cookies.refreshToken]
}

function setTokenCookie(token: string, refreshToken: string, ctx: any = null) {
  setCookie(ctx ?? undefined, Cookies.token, token, {
    maxAge: 60 * 60 * 25 * 30,
    path: '/'
  })
  setCookie(undefined, Cookies.refreshToken, refreshToken, {
    maxAge: 60 * 60 * 25 * 30,
    path: '/'
  })
}

function unsetTokenCookie(ctx: any = null) {
  destroyCookie(ctx ?? undefined, Cookies.token)
  destroyCookie(ctx ?? undefined, Cookies.refreshToken)
}

function setHeaderAuthorization(token: string) {
  api.defaults.headers['Authorization'] = `Bearer ${token}`
}

export {
  getToken,
  getRefreshToken,
  setTokenCookie,
  unsetTokenCookie,
  setHeaderAuthorization
}
