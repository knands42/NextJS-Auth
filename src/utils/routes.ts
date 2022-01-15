import Router from 'next/router'

const goToLogin = async () => Router.push(PagesUris.LOGIN)
const goToDashboard = async () => Router.push(PagesUris.DASHBOARD)

export { goToLogin, goToDashboard }

enum ServerUris {
  ME = '/me',
  SESSIONS = '/sessions'
}

enum ClientUris {}

enum PagesUris {
  LOGIN = '/',
  DASHBOARD = '/dashboard'
}

export { ServerUris, ClientUris, PagesUris }
