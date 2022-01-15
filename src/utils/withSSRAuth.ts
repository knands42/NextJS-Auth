import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult
} from 'next'
import { AuthTokenError } from 'services/errors/AuthTokenError'
import { getToken, unsetTokenCookie } from './cookies'

function withSSRAuth<T>(fn: GetServerSideProps<T>): GetServerSideProps {
  return async (
    ctx: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<T>> => {
    const token = getToken(ctx)

    const redirect = {
      destination: '/',
      permanent: false
    }

    if (!token) {
      return { redirect }
    }

    try {
      return await fn(ctx)
    } catch (err: unknown) {
      if (err instanceof AuthTokenError) {
        unsetTokenCookie(ctx)

        return { redirect }
      }
    }
  }
}

export { withSSRAuth }
