import { Cookies } from 'contexts/AuthContext/types'
import { GetServerSidePropsContext } from 'next'
import { destroyCookie, parseCookies, setCookie } from 'nookies'
import { api } from 'services/apiClient'

function getToken(ctx?: GetServerSidePropsContext): string | undefined {
  const cookies = parseCookies(ctx)
  return cookies[Cookies.token]
}

function getRefreshToken(ctx?: GetServerSidePropsContext): string | undefined {
  const cookies = parseCookies(ctx)
  return cookies[Cookies.refreshToken]
}

function setTokenCookie(
  token: string,
  refreshToken: string,
  ctx?: GetServerSidePropsContext
) {
  setCookie(ctx, Cookies.token, token, {
    maxAge: 60 * 60 * 25 * 30,
    path: '/'
  })
  setCookie(ctx, Cookies.refreshToken, refreshToken, {
    maxAge: 60 * 60 * 25 * 30,
    path: '/'
  })
}

function unsetTokenCookie(ctx?: GetServerSidePropsContext) {
  destroyCookie(ctx, Cookies.token)
  destroyCookie(ctx, Cookies.refreshToken)
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
