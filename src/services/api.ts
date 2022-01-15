import axios, { AxiosError, AxiosInstance } from 'axios'
import { Cookies } from 'contexts/AuthContext/types'
import { parseCookies } from 'nookies'
import { UndefinedContext } from 'types'
import {
  getRefreshToken,
  setHeaderAuthorization,
  setTokenCookie,
  unsetTokenCookie
} from 'utils/cookies'
import { AuthTokenError } from './errors/AuthTokenError'
import {
  ErrorsCodeApiResponse,
  failedRequestsQueueData,
  RefreshTokenApiResponse
} from './types'

let isRefreshing = false
let failedRequestsQueue: failedRequestsQueueData[] = []

function setupAPIClient(ctx: UndefinedContext = undefined): AxiosInstance {
  let cookies = parseCookies(ctx)

  const api = axios.create({
    baseURL: 'http://localhost:3333',
    headers: {
      Authorization: `Bearer ${cookies[Cookies.token]}`
    }
  })

  api.interceptors.response.use(
    response => response,
    (error: AxiosError) => {
      if (checkUnauthorizedStatus(error)) {
        if (checkTokenExpiredStatus(error)) {
          if (!isRefreshing) {
            const refreshToken = getRefreshToken(ctx)

            if (!refreshToken) {
              return new AuthTokenError()
            }

            refreshToken && requestToUpdateToken(refreshToken)
          }

          const originalConfig = error.config

          return new Promise((resolve, reject) => {
            failedRequestsQueue.push({
              resolve: (token: string) => {
                originalConfig.headers['Authorization'] = `Bearer ${token}`

                resolve(api(originalConfig))
              },
              reject: (err: AxiosError) => reject(err)
            })
          })
        } else {
          process.browser
            ? unsetTokenCookie()
            : Promise.reject(new AuthTokenError())
        }
      }

      return Promise.reject(error)
    }
  )

  function logout() {
    process.browser && unsetTokenCookie()
  }

  function requestToUpdateToken(refreshToken: string) {
    setRefreshing()

    api
      .post<RefreshTokenApiResponse>('/refresh', { refreshToken })
      .then(response => {
        const { token, refreshToken: newRefreshToken } = response.data

        setTokenCookie(token, newRefreshToken, ctx)
        setHeaderAuthorization(token)
        retryFailedRequests(token)
      })
      .catch((err: AxiosError) => catchErrorWhenRefreshing(err))
      .finally(() => resetRefreshing())
  }

  function checkUnauthorizedStatus(error: AxiosError): boolean {
    return error.response?.status === 401
  }

  function checkTokenExpiredStatus(error: AxiosError): boolean {
    return error.response?.data?.code === ErrorsCodeApiResponse.tokenExpired
  }

  function retryFailedRequests(token: string) {
    failedRequestsQueue.forEach(request => request.resolve(token))
    failedRequestsQueue = []
  }

  function catchErrorWhenRefreshing(error: AxiosError): void {
    failedRequestsQueue.forEach(request => request.reject(error))
    failedRequestsQueue = []

    logout()
  }

  function setRefreshing() {
    isRefreshing = true
  }

  function resetRefreshing() {
    isRefreshing = false
  }

  return api
}

export { setupAPIClient }
