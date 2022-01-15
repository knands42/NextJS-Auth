import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult
} from 'next'
import { PagesUris } from 'utils/routes'
import { getToken } from '../cookies'

function withSSRGuest<T>(fn: GetServerSideProps<T>): GetServerSideProps {
  return async (
    ctx: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<T>> => {
    const token = getToken(ctx)

    if (token) {
      return {
        redirect: {
          destination: PagesUris.DASHBOARD,
          permanent: false
        }
      }
    }

    return await fn(ctx)
  }
}

export { withSSRGuest }
