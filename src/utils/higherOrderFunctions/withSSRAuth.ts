import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult
} from 'next'
import { AuthTokenError } from 'services/errors/AuthTokenError'
import decode from 'jwt-decode'
import { UserPermRoles, UserTokenDecode } from 'contexts/AuthContext/types'
import { PagesUris } from 'utils/routes'
import { getToken, unsetTokenCookie } from 'utils/cookies'
import { validateUserPermRoles } from 'utils/validateUserPermRoles'

type withSSRAuthOptions = UserPermRoles

function withSSRAuth<T>(
  fn: GetServerSideProps<T>,
  options?: withSSRAuthOptions
): GetServerSideProps {
  return async (
    ctx: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<T>> => {
    const token = getToken(ctx)

    if (!token) {
      return {
        redirect: {
          destination: PagesUris.LOGIN,
          permanent: false
        }
      }
    }

    if (options) {
      const user = decode<UserTokenDecode>(token)
      const { permissions, roles } = options
      const userHasValidPermissions = validateUserPermRoles({
        user,
        permissions,
        roles
      })

      if (!userHasValidPermissions) {
        return {
          redirect: {
            destination: PagesUris.DASHBOARD,
            permanent: false
          }
        }
      }
    }

    try {
      return await fn(ctx)
    } catch (err: unknown) {
      if (err instanceof AuthTokenError) {
        unsetTokenCookie(ctx)

        return {
          redirect: {
            destination: PagesUris.LOGIN,
            permanent: false
          }
        }
      }
    }
  }
}

export { withSSRAuth }
