import axios, { AxiosError } from 'axios'
import { Cookies, User } from 'contexts/AuthContext/types'
import { parseCookies } from 'nookies'
import {
  getRefreshToken,
  setHeaderAuthorization,
  setTokenCookie,
  unsetTokenCookie
} from 'utils/cookies'
import {
  ErrorsCodeApiResponse,
  failedRequestsQueueData,
  RefreshTokenApiResponse
} from './types'

let cookies = parseCookies()
let isRefreshing = false
let failedRequestsQueue: failedRequestsQueueData[] = []

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
        updateToken()

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
        logout()
      }
    }

    return Promise.reject(error)
  }
)

function logout() {
  unsetTokenCookie()
}

function updateToken() {
  if (!isRefreshing) {
    const refreshToken = getRefreshToken()
    requestToUpdateToken(refreshToken)
  }
}

function requestToUpdateToken(refreshToken: string) {
  setRefreshing()

  api
    .post<RefreshTokenApiResponse>('/refresh', { refreshToken })
    .then(response => {
      const { token, refreshToken: newRefreshToken } = response.data

      setTokenCookie(token, newRefreshToken)
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
}

function setRefreshing() {
  isRefreshing = true
}

function resetRefreshing() {
  isRefreshing = false
}

export { api }
