import { AxiosError } from 'axios'

export enum ErrorsCodeApiResponse {
  tokenExpired = 'token.expired'
}
export type RefreshTokenApiResponse = {
  token: string
  refreshToken: string
}

export type failedRequestsQueueData = {
  resolve: (token: string) => void
  reject: (err: AxiosError) => void
}
